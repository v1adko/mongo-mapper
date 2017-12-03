const MongoMapper = require('./mongo-mapper');

class TestMongoMapper extends MongoMapper {
  async haveOneInCollection(collection, documentParams) {
    const dbDocument = await this.findOne(collection, documentParams);
    if (dbDocument === null) {
      throw new Error('Object was not found in the database');
    }
    // Key-by-key deep equal check
    for (const prop of Object.keys(documentParams)) {
      expect(documentParams[prop]).toEqual(
        dbDocument[prop],
        `Values during find didn't match on '${prop}' field`
      );
    }
  }

  async haveInCollection(collection, documentsParams) {
    if (documentsParams.constructor === Array) {
      expect(documentsParams).toBeInstanceOf(Array);
      for (const documentParams of documentsParams) {
        await this.haveOneInCollection(collection, documentParams);
      }
    } else {
      expect(documentsParams).toBeInstanceOf(Object);
      await this.haveOneInCollection(collection, documentsParams);
    }
  }

  async dontHaveOneInCollection(collection, documentParams) {
    const documents = await this.find(collection, documentParams);
    if (documents.length !== 0) {
      throw new Error(`Found ${documents.length} documents`);
    }
    expect(documents.length).toBe(0, 'Found the document');
  }

  async dontHaveInCollection(collection, documentsParams) {
    if (documentsParams.constructor === Array) {
      expect(documentsParams).toBeInstanceOf(Array);
      for (const documentParams of documentsParams) {
        await this.dontHaveOneInCollection(collection, documentParams);
      }
    } else {
      expect(documentsParams).toBeInstanceOf(Object);
      await this.dontHaveOneInCollection(collection, documentsParams);
    }
  }
}

module.exports = TestMongoMapper;
