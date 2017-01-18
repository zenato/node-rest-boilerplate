import { Router } from 'express';
import validate from 'validate.js';
import { Board } from '../models';

const router = Router();

const constraints = {
  title: {
    presence: true,
    length: {
      minimum: 5,
      maximum: 100,
    },
  },
  content: {
    presence: true,
  },
};

router.get('/', async (req, res, next) => {
  try {
    res.json(await Board.list(req.query));
  } catch (e) {
    next(e);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const model = await Board.findByIdWithCreator(req.params.id);
    if (!model) {
      res.sendStatus(404);
      return;
    }
    res.json(model);
  } catch (e) {
    next(e);
  }
});

router.post('/save', async (req, res, next) => {
  try {
    const validationErrors = validate(req.body, constraints);
    if (validationErrors) {
      res.status(400).json({ validationErrors });
      return;
    }

    res.json(await Board.createByUser(req.body, req.user));
  } catch (e) {
    next(e);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const validationErrors = validate(req.body, constraints);
    if (validationErrors) {
      res.status(400).json({ validationErrors });
      return;
    }

    const model = await Board.findByIdWithCreator(req.params.id);
    if (!model || !model.isCreator(req.user)) {
      res.sendStatus(404);
      return;
    }

    res.json(await model.update(req.body));
  } catch (e) {
    next(e);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const model = await Board.findByIdWithCreator(req.params.id);
    if (!model || !model.isCreator(req.user)) {
      res.sendStatus(404);
      return;
    }
    res.json(await model.remove());
  } catch (e) {
    next(e);
  }
});

export default router;
