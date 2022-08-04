import { appPort } from './../../index';
import { faker } from '@faker-js/faker';
import mongoose from 'mongoose';
import request from 'supertest';
import { User } from '../services/userCredential.service';

// jest.spyOn(process, 'exit').mockImplementation(() => { throw new Error('Failed to connect with the database.'); });

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
});

describe('BE API - FOR HOMEPAGE', () => {
    beforeEach((done) => {
        jest.clearAllMocks();
        mongoose.connect(URL).then(() => done())
      });
      
      afterEach((done) => {
        mongoose.connection.db.dropDatabase(() => {
          mongoose.connection.close(() => done())
        });
      });

      it('GET - / - Success to get homepage', async () => {
        const res = await request(appPort).get('/api/');

        expect(res.body).toEqual({ message: 'okie' });
      });
});

describe('BE API - FOR AUTHENTICATION', () => {
    let modal: any;

    beforeEach((done) => {
      jest.clearAllMocks();
      mongoose.connect(URL).then(() => done());
      modal = User;
    });
      
    afterEach((done) => {
            mongoose.connection.db.dropDatabase(() => {
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

    it('POST - /api/auth/create -  Fail - not send all required data', async () => {
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

        // Deleting the data from database.
        await User.deleteOne({ email });
    });
});