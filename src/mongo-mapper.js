const get = require('lodash.get');

// Can be used outside of testing (jest)
class MongoMapper {
  constructor(contextPromise, options = {}) {
    this.dbContextPromise = contextPromise;
    this.options = options;
  }

  getDbContext() {
    return this.dbContextPromise;
  }

  getResultValue(result, method) {
    switch (method) {
    case 'findAndModify':
      return result.value;

    default:
      return result;
    }
  };

  async executeMongoMethod(collection, method, resultKey, ...params) {
    const dbContext = await this.getDbContext();
    const result = await dbContext.collection(collection)[method](...params);
    const value = this.getResultValue(result, method);

    if (value && value._id && this.options.omitMongoId) {
      delete value._id;
    }

    return resultKey ? get(value, resultKey) : value;
  }

  cursorToArray(cursor) {
    return new Promise((resolve, reject) =>
      cursor.toArray((err, docs) => (err ? reject(err) : resolve(docs)))
    );
  }

  findOne(collection, params) {
    return this.executeMongoMethod(collection, 'findOne', undefined, params);
  }

  async find(collection, params = {}, projection) {
    const cursor = await this.executeMongoMethod(
      collection,
      'find',
      undefined,
      params,
      projection
    );
    return this.cursorToArray(cursor);
  }

  count(collection, params = {}) {
    return this.getDbContext().then(dbContext =>
      dbContext.collection(collection).count(params)
    );
  }

  insert(collection, data) {
    let immutableData = data;

    // Due to the weird bug that upon insert mongo mutates the passed objects/arrays
    // by adding _id key and value
    if (data.constructor === Array) {
      immutableData = data.map(item => Object.assign({}, item));
    } else if (typeof data === 'object') {
      immutableData = Object.assign({}, data);
    } else {
      throw new Error(`Unknown type specified for insertion: ${typeof data}`);
    }

    return this.executeMongoMethod(
      collection,
      'insert',
      undefined,
      immutableData
    );
  }

  insertMany(collections, datas) {
    return Promise.all(
      collections.map((collection, idx) => this.insert(collection, datas[idx]))
    );
  }

  update(collection, criteria, replacement) {
    return this.executeMongoMethod(
      collection,
      'findAndModify',
      undefined,
      criteria,
      null,
      { $set: replacement },
      { new: true }
    );
  }

  updateAll(collection, criteria = {}, replacement = {}) {
    return this.executeMongoMethod(
      collection,
      'update',
      'result.nModified',
      { ...criteria, $isolated: 1 },
      { $set: replacement },
      { new: true, multi: true }
    );
  }

  remove(collection, params = {}) {
    return this.executeMongoMethod(collection, 'remove', undefined, params);
  }

  clearCollection(collection) {
    return this.remove(collection);
  }

  clearCollections(collections) {
    return Promise.all(collections.map(name => this.clearCollection(name)));
  }

  async replace(collection, data) {
    await this.clearCollection(collection);
    return this.insert(collection, data);
  }

  async replaceMany(collections, datas) {
    await this.clearCollections(collections);
    return this.insertMany(collections, datas);
  }

  drop() {
    return this.getDbContext().then(db => db.dropDatabase());
  }
}

module.exports = MongoMapper;
