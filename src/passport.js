import passport from 'passport';
import { Strategy } from 'passport-http-bearer';
import { User } from './models';

export default function () {
  passport.use(new Strategy(async (token, done) => {
    try {
      const user = await User.findByToken(token);
      if (user) {
        done(null, user);
      } else {
        done(null, false);
      }
    } catch (e) {
      done(e);
    }
  }));
}
