/* eslint no-underscore-dangle: ["error", { "allow": ["_id", "_creator"] }] */

import mongoose, { Schema } from 'mongoose';

const UserSchema = new Schema({
  email: String,
  name: String,
  password: String,
  photo: String,
  auth: {
    facebook: String,
  },
  token: String,
}, { timestamps: true });


UserSchema.statics.findByEmail = function findByEmail(email) {
  return this.findOne({ email }).exec();
};

UserSchema.statics.findByToken = function findByToken(token) {
  return this.findOne({ token }).exec();
};

UserSchema.statics.findByName = function findByName(name) {
  return this.find({ name: new RegExp(name, 'i') }).select('_id');
};

UserSchema.statics.findByUser = function findByUser(user) {
  return this.findById(user._id);
};

UserSchema.statics.updateByUser = function updateByUser(user, params) {
  return this.findOneAndUpdate({ _id: user._id }, params);
};

UserSchema.statics.expireToken = function expireToken(email) {
  return this.update({ email }, { token: null });
};

export default mongoose.model('User', UserSchema);
