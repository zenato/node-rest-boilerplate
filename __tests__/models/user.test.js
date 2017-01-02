import mongoose from 'mongoose';
import { config } from '../../src/env';
import connect from '../../src/db';
import User from '../../src/models/user';

// test user information
const testEmail = 'tester@test.com';
const testToken = 'test_token';
const testName = 'Test User Name';
const testUser = {};


describe('User', () => {
  beforeAll((done) => {
    config();
    connect(process.env.DB_URI);
    mongoose.connection.once('open', () => done());
    mongoose.connection.once('error', err => done.fail(err));
  });

  it('findByEmail', async () => {
    try {
      const user = await User.findByEmail(testEmail);
      // expect(user).not.toBeNull();
    } catch (e) {
      expect(e).toEqual('Not found user by email.');
    }
  });

  it('findByToken', async () => {
    try {
      const user = await User.findByToken(testToken);
      // expect(user).toBeNull();
    } catch (e) {
      expect(e).toEqual('Not found user by token.');
    }
  });

  it('findByName', async () => {
    try {
      const user = await User.findByName(testName);
      // expect(user).not.toBeNull();
    } catch (e) {
      expect(e).toEqual('Not found user by name.');
    }
  });

  it('findByUser', async () => {
    try {
      const user = await User.findByUser(testUser);
      // expect(user).not.toBeNull();
    } catch (e) {
      expect(e).toEqual('Not found user by user object.');
    }
  });

  it('updateByUser', async () => {
    try {
      await User.updateByUser(testUser, {});
    } catch (e) {
      expect(e).toEqual('Cannot update user by user object.');
    }
  });

  it('exireToken', async () => {
    try {
      await User.expireToken(testEmail);
    } catch (e) {
      expect(e).toEqual('Cannot expire token by email.');
    }
  });

  afterAll(() => {
    mongoose.connection.close();
  });
});
