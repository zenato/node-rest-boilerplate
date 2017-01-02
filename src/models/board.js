/* eslint no-underscore-dangle: ["error", { "allow": ["_id", "_creator"] }] */

import mongoose, { Schema } from 'mongoose';
import paginate from 'mongoose-paginate';
import User from './user';

const BoardSchema = new Schema({
  title: String,
  content: String,
  _creator: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
}, {
  timestamps: true,
});

async function createCriteria(query) {
  try {
    const filters = {};

    if (query.title) {
      filters.title = new RegExp(query.title, 'i');
    }

    if (query.name) {
      const users = await User.findByName(query.name);
      filters._creator = { $in: users.map(u => u._id) };
    }

    return filters;
  } catch (e) {
    throw e;
  }
}

BoardSchema.methods.isCreator = function equalCreator(user = {}) {
  return this._creator._id === user._id;
};

BoardSchema.statics.list = async function list(query) {
  try {
    const options = {
      page: Number(query.page) || 1,
      limit: Number(query.limit) || 10,
      sort: query.sort || '-_id',
      populate: [{ path: '_creator', select: 'name' }],
    };
    const criteria = await createCriteria(query);
    return this.paginate(criteria, options).then(({ docs, ...pagination }) => ({
      items: docs,
      pagination: {
        ...pagination,
        index: pagination.total - ((pagination.page - 1) * pagination.limit),
      },
    }));
  } catch (e) {
    throw e;
  }
};

BoardSchema.statics.findByIdWithCreator = function findByIdWithCreator(id) {
  return this.findById(id).populate('_creator', 'name');
};

BoardSchema.statics.createByUser = function crateByUser(params, user) {
  if (!user) {
    throw new Error('Required creator.');
  }
  return this.create({
    ...params,
    _creator: user._id,
  });
};

BoardSchema.plugin(paginate);

export default mongoose.model('Board', BoardSchema);
