import { Router } from 'express';
import validate from 'validate.js';
import jwt from 'jsonwebtoken';
import { User } from '../models';

const router = Router();

const constraints = {
  email: {
    email: true,
    length: {
      maximum: 150,
    },
  },
  password: {
    presence: true,
    length: {
      minimum: 6,
      maximum: 20,
    },
  },
  name: {
    presence: true,
    length: {
      minimum: 3,
      maximum: 100,
    },
  },
};

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = constraints;
    const validationErrors = validate(req.body, { email, password });
    if (validationErrors) {
      res.status(400).json({ validationErrors });
      return;
    }

    const user = await User.findByEmail(req.body.email);
    if (!user || user.password !== req.body.password) {
      res.status(401).json({ reason: 'Check your account' });
      return;
    }

    const token = jwt.sign({ id: user.id }, process.env.SECRET || 'secret');
    user.token = token;
    await user.save();
    res.json({ accessToken: token });
  } catch (e) {
    next(e);
  }
});

router.get('/logout', async (req, res, next) => {
  try {
    if (req.user) {
      await User.expireToken(req.user.email);
    }
    res.json({ success: true });
  } catch (e) {
    next(e);
  }
});

router.post('/join', async (req, res, next) => {
  try {
    const validationErrors = validate(req.body, constraints);
    if (validationErrors) {
      res.status(400).json({ validationErrors });
      return;
    }

    const model = await User.findByEmail(req.body.email);
    if (model) {
      res.status(400).json({ alreadyExists: true });
      return;
    }

    res.json(await User.create(req.body));
  } catch (e) {
    next(e);
  }
});

router.get('/me', (req, res) => res.json(req.user));

router.put('/me', async (req, res, next) => {
  try {
    const params = { ...req.body };
    const updateConstraints = {
      ...constraints,
    };

    // Delete constraints if blank password.
    if (!params.password) {
      delete params.password;
      delete updateConstraints.password;
    }

    const validationErrors = validate(updateConstraints);
    if (validationErrors) {
      res.status(400).json({ validationErrors });
      return;
    }

    await User.updateByUser(req.user, params);
    res.json(await User.findByUser(req.user));
  } catch (e) {
    next(e);
  }
});

export default router;
