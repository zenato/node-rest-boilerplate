import fs from 'fs';
import { join } from 'path';
import dotenv from 'dotenv';

// Initialize config
dotenv.config({ silent: true });

const IS_PROD = process.env.NODE_ENV === 'production';
const EXISTS_CONFIG = process.env.SKIP_CONFIG ? true : fs.existsSync(join(process.cwd(), '.env'));

export {
  IS_PROD,
  EXISTS_CONFIG,
};
