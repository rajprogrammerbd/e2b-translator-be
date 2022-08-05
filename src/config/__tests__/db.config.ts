import Database from "../db.config";

jest.mock('mongoose', () => ({
    connect: jest.fn().mockRejectedValue('Failed to connect with the database')
}));

describe('Database', () => {
    it('create database connection and reject', async () => {
        Database.connect().catch(err => {
            expect(err).toBe('Failed to connect with the database');
        });
    });
});