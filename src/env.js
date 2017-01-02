import dotenv from 'dotenv';

const isProd = process.env.NODE_ENV === 'production';

function config(skip) {
  return skip ? {} : dotenv.config();
}

export {
  isProd,
  config,
};