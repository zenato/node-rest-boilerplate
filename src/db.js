import mongoose from 'mongoose';

mongoose.Promise = global.Promise;

export default (uri, poolSize = 1) => mongoose.connect(uri, {
  server: {
    poolSize,
  },
});
