import { appPort } from '../../index';
import { faker } from '@faker-js/faker';
import mongoose from 'mongoose';
import request from 'supertest';
import supertest from 'supertest';
import { User } from '../services/userCredential.service';

jest.mock('mongoose', () => {
    // Require the original module to not be mocked...
    const originalModule = jest.requireActual('mongoose');
  
    return {
      __esModule: true, // Use it when dealing with esModules
      ...originalModule,
      connect: jest.fn().mockRejectedValue('failed to connect with the database'),
    };
  });

const URL = process.env.MONGODB_ACCESS_URL as string;

test('GET - / - Failed to connect with the database', async () => {
    const res = await request(appPort).get('/api/');

    expect(res.statusCode).toBe(500);
    expect(res.body).toEqual({ message: 'Internal Error' });

    appPort.close();
});

describe('BE API - FOR HOMEPAGE', () => {
    beforeEach((done) => {
        jest.clearAllMocks();
        mongoose.connect(URL).then(() => done())
      });
      
      afterEach((done) => {
        mongoose.connection.db.dropDatabase(() => {
          appPort.close();
          mongoose.connection.close(() => done())
        });
      });

      it('GET - / - Success to get homepage', async () => {
        const res = await request(appPort).get('/api/');

        expect(res.body).toEqual({ message: 'okie' });
      });
});

describe('BE API - FOR AUTHORIZATION', () => {
  beforeEach((done) => {
    jest.clearAllMocks();
    mongoose.connect(URL).then(() => done());
  });
    
  afterEach((done) => {
        mongoose.connection.db.dropDatabase(() => {
          appPort.close();
          mongoose.connection.close(() => done())
      });
  });

  it('POST - /api/auth/login - Fail - not send all required data', async () => {
    const email = faker.internet.email();

    const res = await request(appPort).post('/api/auth/login').send({ email });

    expect(res.statusCode).toBe(404);
    expect(res.body).toEqual({ message: 'User needs to send all required data' });
  });

  it('POST - /api/auth/login - Login system', async () => {
    const name = faker.name.findName();
    const email = faker.internet.email();
    const password = 'fakePassword';
    const userName = 'mockUserName';
    
    // Create a user.
    await request(appPort).post('/api/auth/create').send({name, email, password, userName});

    // login the user.
    const res = await request(appPort).post('/api/auth/login').send({ email, password });

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({
      success: true,
      name,
      email
    });

    const notMatchPassword = await request(appPort).post('/api/auth/login').send({ email, password: 'wrongPasswordToFail' });

    expect(notMatchPassword.statusCode).toBe(500);
    expect(notMatchPassword.body).toEqual({ message: 'Error: Incorrect passport' });

    const notFoundUser = await request(appPort).post('/api/auth/login').send({ email: faker.internet.email(), password });
    
    expect(notFoundUser.statusCode).toBe(500);
    expect(notFoundUser.body).toEqual({ message: "Error: Couldn't able to find user" });

    const removedTitle = res.headers['set-cookie'][0].replace('LOGIN_ACCESS_COOKIE=', '');
    const slicedCookie = removedTitle.substring(0, removedTitle.indexOf('; Max-Age=360;'));

    const sendCookie = await request(appPort).post('/api/auth/login').set('Cookie', `LOGIN_ACCESS_COOKIE=${slicedCookie}`).send({ email, password });

    expect(sendCookie.statusCode).toBe(406);
    expect(sendCookie.body).toEqual({ message: 'User already logged in' });

    const sendWrongCookie = await request(appPort).post('/api/auth/login').set('Cookie', `LOGIN_ACCESS_COOKIE=abd`).send({ email, password });

    expect(sendWrongCookie.statusCode).toBe(200);
    expect(sendWrongCookie.body).toEqual({
      success: true,
      name,
      email
    });

    const defaultAgent = new Proxy(supertest(appPort), {
      get: (target, name) => (...args: any[]) =>
        (target as any)[name](...args).set({
          'Authorization': slicedCookie
        })
    });

    const failedLogin = await defaultAgent.post('/api/auth/login').send({ email, password });

    expect(failedLogin.statusCode).toBe(406);
    expect(failedLogin.body).toEqual({ message: 'User already logged in' });

    await User.deleteOne({ email });
  });
});

describe('BE API - FOR AUTHENTICATION', () => {
    beforeEach((done) => {
      jest.clearAllMocks();
      mongoose.connect(URL).then(() => done());
    });
      
    afterEach((done) => {
          mongoose.connection.db.dropDatabase(() => {
            appPort.close();
            mongoose.connection.close(() => done())
        });
    });

    it('POST - /api/auth/create -  Fail - not send all required data', async () => {
        const name = faker.name.findName();
        const email = faker.internet.email();
        const password = 'fakePassword';
        const res = await request(appPort).post('/api/auth/create').send({name, email, password});

        expect(res.statusCode).toBe(404);
        expect(res.body).toEqual({ message: 'User needs to send all required data' });
    });

    it('POST - /api/auth/create -  Success - Successfully create a user.', async () => {
        const name = faker.name.findName();
        const email = faker.internet.email();
        const password = 'fakePassword';
        const userName = 'mockUserName';
        const res = await request(appPort).post('/api/auth/create').send({name, email, password, userName});

        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({
            success: true,
            message: 'User created successfully',
            user: { name, email }
        });

        await User.deleteOne({ email });
    });
});