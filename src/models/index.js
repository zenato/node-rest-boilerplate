import connect from './db';
import User from './user';
import Board from './board';

connect(process.env.DB_URI, process.env.DB_POOL_SIZE);

export {
  User,
  Board,
};
