import passport from 'passport';
import BearerStrategy from 'passport-http-bearer';
import { User } from './models';

export default function () {
  passport.use(new BearerStrategy(async (token, done) => {
    try {
      const user = await User.findByToken(token);
      if (user) {
        done(null, user);
      } else {
        done(null, false);
      }
    } catch (e) {
      console.log(e);
      done(e);
    }
  }));
}
