import { MongoClient } from 'mongodb';
import { connectionString } from '../config';
import MongoMapperProvider from '../mongo-mapper-provider';

describe('mongo mapper suite', () => {
  it('creates new mongo mapper from valid connection string', () => {
    const mongoMapperProvider = new MongoMapperProvider();
    const mongomapper = mongoMapperProvider.getMongoMapper({
      connectionString
    });

    expect(mongomapper).toBeTruthy();
  });

  it('creates new mongo mapper from valid connection string twice, to ensure in memoization of dbContext', () => {
    const mongoMapperProvider = new MongoMapperProvider();
    mongoMapperProvider.getMongoMapper({ connectionString });
    mongoMapperProvider.getMongoMapper({ connectionString });
  });

  it('throws an error on db client connection error', async () => {
    const mongoMapperProvider = new MongoMapperProvider();

    MongoClient.connect = jest.fn((string, cb) =>
      setTimeout(() => cb(new Error('Mock error')), 100)
    );
    const { dbContextPromise } = mongoMapperProvider.getMongoMapper({
      connectionString
    });
    expect(MongoClient.connect.mock.calls.length).toEqual(1);
    MongoClient.connect.mockRestore();

    try {
      await dbContextPromise;
    } catch (err) {
      expect(err.message).toBe('Mock error');
    }
  });
});
