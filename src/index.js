import 'source-map-support/register';
import { config } from 'dotenv';
import express from 'express';
import bodyParser from 'body-parser';
import passport from 'passport';
import morgan from 'morgan';
import emoji from 'node-emoji';
import { green, red } from 'chalk';
import connect from './db';
import configStretegy from './passport';
import cors from './middlewares/cors';
import routes from './routes';

// Load config
if (!process.env.SKIP_LOAD_ENV && config().error) {
  console.info(emoji.get('rain_cloud') + red('  Cannot find .env configuration.'));
  console.log();
  process.exit(0);
}

// Database connection
connect(process.env.DB_URI);

// Passport stretegy
configStretegy();

const app = express();
const port = process.env.PORT || 4000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(passport.initialize());
app.disable('x-powered-by');

app.use(cors);
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
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
