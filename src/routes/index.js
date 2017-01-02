import express from 'express';
import passport from 'passport';
import userRouter from './user';
import boardRouter from './board';

const router = express.Router(); // eslint-disable-line new-cap

// Requred authenticate
router.use([
  '/user/me',
  '/board/save',
  '/board/update',
  '/board/remove',
], passport.authenticate('bearer', { session: false }));

router.use('/user', userRouter);
router.use('/board', boardRouter);

export default router;
