import express from 'express';
import passport from 'passport';
import userRouter from './user';
import boardRouter from './board';

const router = express.Router(); // eslint-disable-line new-cap

// Index page
router.get('/', (req, res) => {
  res.send('API server is running.');
});

// Requred authenticate
const auth = passport.authenticate('bearer', { session: false });
router.use([
  '/user/me',
  // TODO: any URL
], auth);
router.put('/board/:id', auth);
router.delete('/board/:id', auth);
router.post('/board/save', auth);

router.use('/user', userRouter);
router.use('/board', boardRouter);

export default router;
