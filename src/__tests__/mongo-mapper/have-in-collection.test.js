import getMongoMapper from '../../';
import productMocks from '../mocks/products.json';

describe('Have in collection method', () => {
  const productsCollectionName = 'products';
  const mongoMapper = getMongoMapper();

  beforeEach(async () => {
    await mongoMapper.clearCollection(productsCollectionName);
    await mongoMapper.insert(productsCollectionName, productMocks);
  });

  it('checks is mock data exists in db [array]', async () => {
    await mongoMapper.haveInCollection(productsCollectionName, productMocks);
  });

  it('checks is mock data exists in db [single object]', async () => {
    await mongoMapper.haveInCollection(productsCollectionName, productMocks[0]);
    await mongoMapper.haveInCollection(productsCollectionName, productMocks[3]);
  });

  it('throws if data is not in db [array]', async () => {
    try {
      await mongoMapper.haveInCollection(productsCollectionName, [
        { name: 'Product_1' },
        { name: 'Product_2' }
      ]);
      throw new Error('Should not execute');
    } catch (err) {
      expect(err.message).toBe('Object was not found in the database');
    }
  });

  it('throws if data is not in db [single object]', async () => {
    try {
      await mongoMapper.haveInCollection(productsCollectionName, {
        name: 'Product_1'
      });
      throw new Error('Should not execute');
    } catch (err) {
      expect(err.message).toBe('Object was not found in the database');
    }
  });
});
