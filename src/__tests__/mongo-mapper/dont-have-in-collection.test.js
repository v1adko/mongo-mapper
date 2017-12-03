import getMongoMapper from '../../';
import productMocks from '../mocks/products.json';

describe("Don't have in collection method", () => {
  const productsCollectionName = 'products';
  const mongoMapper = getMongoMapper();

  beforeEach(async () => {
    await mongoMapper.clearCollection(productsCollectionName);
    await mongoMapper.insert(productsCollectionName, productMocks);
  });

  it("checks is mock data doesn't exists in db", async () => {
    await mongoMapper.dontHaveInCollection(productsCollectionName, {
      name: 'Mackbook Pro'
    });
  });

  it('throws if data is in db [single object only]', async () => {
    try {
      await mongoMapper.dontHaveInCollection(
        productsCollectionName,
        productMocks[0]
      );
      throw new Error('Should not execute');
    } catch (err) {
      expect(err.message).toBe('Found 1 documents');
    }
  });

  it('throws if data is in db [array]', async () => {
    try {
      await mongoMapper.dontHaveInCollection(
        productsCollectionName,
        productMocks
      );
      throw new Error('Should not execute');
    } catch (err) {
      expect(err.message).toBe('Found 1 documents');
    }
  });
});
