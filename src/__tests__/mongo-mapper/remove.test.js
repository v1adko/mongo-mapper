import getMongoMapper from '../../';
import productMocks from '../mocks/products.json';

describe('Removing capabilities of MongoMapper class', () => {
  const mongoMapper = getMongoMapper();
  const productsCollectionName = 'products';

  beforeEach(async () => {
    await mongoMapper.remove(productsCollectionName);
    await mongoMapper.insert(productsCollectionName, productMocks);
  });

  it('removes all products', async () => {
    const products = await mongoMapper.find(productsCollectionName);

    expect(products.length).toBe(6);

    await mongoMapper.remove(productsCollectionName);

    const deleted = await mongoMapper.find(productsCollectionName);

    expect(deleted.length).toBe(0);
  });

  it('drops the database', async () => {
    const products = await mongoMapper.find(productsCollectionName);
    expect(products.length).toBe(6);

    const result = await mongoMapper.drop();
    expect(result).toBe(true);

    const deleted = await mongoMapper.find(productsCollectionName);
    expect(deleted.length).toBe(0);
  });

  it('removes specified item', async () => {
    const products = await mongoMapper.find(productsCollectionName, {
      name: 'Apple Watch'
    });

    expect(products.length).toBe(1);

    await mongoMapper.remove(productsCollectionName);

    const deleted = await mongoMapper.find(productsCollectionName, {
      name: 'Apple Watch'
    });

    expect(deleted.length).toBe(0);

    // Should remember about identitycounters collection!
  });
});
