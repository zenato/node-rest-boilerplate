import fs from 'fs';
import { join } from 'path';

const isProduction = process.env.NODE_ENV === 'production';
const existsConfig = fs.existsSync(join(process.cwd(), '.env'));

export {
  isProduction,
  existsConfig,
};
