const { MongoClient } = require('mongodb');
const get = require('lodash.get');
const MongoMapper = require( './test-mongo-mapper');
const TestMongoMapper = require( './test-mongo-mapper');
const safeRequire = require( './utils/safe-require');

class MongoMapperProvider {
  getMongoMapper({ isTesting, connectionString, useMongoose }) {
    const dbContextPromise = this.getDbContextPromise(
      connectionString,
      useMongoose
    );

    const Mapper =
      isTesting || process.env.NODE_ENV === 'test'
        ? TestMongoMapper
        : MongoMapper;

    return new Mapper(dbContextPromise);
  }

  getDbContextPromise(connectionString, useMongoose) {
    if (this.dbContext) {
      return Promise.resolve(this.dbContext);
    }

    const mongoose = safeRequire('mongoose', useMongoose);

    if (mongoose && get(mongoose, 'connection.db')) {
      this.dbContext = mongoose.connection.db;
      return Promise.resolve(this.dbContext);
    }

    if (!connectionString) {
      throw new Error('No connection string specified');
    }

    return new Promise((resolve, reject) =>
      MongoClient.connect(connectionString, (error, dbContext) => {
        if (error) {
          return reject(error);
        }

        if (this.dbContext !== null) {
          return Promise.resolve(this.dbContext);
        }

        this.dbContext = dbContext;

        return resolve(dbContext);
      })
    );
  }
}

module.exports = MongoMapperProvider;
