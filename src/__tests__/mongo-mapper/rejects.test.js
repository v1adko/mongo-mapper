import { MongoClient } from 'mongodb';
import MongoMapperProvider from '../../mongo-mapper-provider';

describe('Query capabilities of MongoMapper class', () => {
  const collectionName = 'products';

  const mockError = new Error('Mock error');
  const throwError = async () => {
    throw mockError;
  };

  const collection = {
    findOne: {
      findOne: throwError
    },
    find1: {
      find: throwError
    },
    find2: {
      find: () => ({ toArray: cb => cb(mockError) })
    },
    insert: {
      insert: throwError
    },
    update: {
      findAndModify: throwError
    },
    remove: {
      remove: throwError
    }
  };

  const mockReject = async (collectionPart, funcName, params = {}) => {
    MongoClient.connect = jest.fn((string, cb) =>
      setTimeout(() => cb(null, { collection: () => collectionPart }), 10)
    );
    const mockMongoMapper = new MongoMapperProvider().getMongoMapper({ connectionString: 'string' });
    expect(MongoClient.connect.mock.calls.lenght).toBe();

    try {
      await mockMongoMapper[funcName](collectionName, params);
      throw new Error('Should not execute');
    } catch (err) {
      expect(err.message).toBe('Mock error');
    }
  };

  afterEach(() => MongoClient.connect.mockRestore());

  it('throws on find', () => mockReject(collection.find1, 'find'));

  it('throws on find (first level)', () =>
    mockReject(collection.find2, 'find'));

  it('throws on find one', () => mockReject(collection.findOne, 'findOne'));

  it('throws on insert', () => mockReject(collection.insert, 'insert'));

  it('throws on update', () => mockReject(collection.update, 'update'));

  it('throws on remove', () => mockReject(collection.remove, 'remove'));
});
