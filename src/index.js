import 'source-map-support/register';
import 'dotenv/config';
import express from 'express';
import bodyParser from 'body-parser';
import passport from 'passport';
import morgan from 'morgan';
import emoji from 'node-emoji';
import { green, red } from 'chalk';
import { isProduction, existsConfig } from './lib/config';
import routes from './routes';
import './passport';

if (!existsConfig) {
  console.info(emoji.get('rain_cloud') + red('  Cannot find .env configuration.'));
  console.log();
  process.exit(1);
}

const app = express();
const port = process.env.PORT || 4000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(passport.initialize());
app.disable('x-powered-by');

app.use(morgan(isProduction ? 'dev' : 'combined'));
app.use(routes);

app.use((req, res) => {
  res.sendStatus(404);
});

app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  console.error(err);
  res.status(500).json({ reason: err });
});

app.listen(port, () => {
  process.stdout.write('\x1Bc');
  console.info(emoji.get('sparkles') + green(`  Server listening on port ${port}.`));
  console.log();
});
