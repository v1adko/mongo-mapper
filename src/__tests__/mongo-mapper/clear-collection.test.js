import getMongoMapper from '../../';
import productMocks from '../mocks/products.json';

describe('Removing capabilities of MongoMapper class', () => {
  const productsCollectionName = 'products';
  const mongoMapper = getMongoMapper();

  beforeEach(async () => {
    await mongoMapper.remove(productsCollectionName);
    await mongoMapper.insert(productsCollectionName, productMocks);
  });

  it('clears all collections', async () => {
    await mongoMapper.clearCollection(productsCollectionName);

    const deleted = await mongoMapper.find(productsCollectionName);

    expect(deleted.length).toBe(0);
  });

  it('clears one collection', async () => {
    await mongoMapper.clearCollection(productsCollectionName);

    const deleted = await mongoMapper.find(productsCollectionName);

    expect(deleted.length).toBe(0);
  });
});
