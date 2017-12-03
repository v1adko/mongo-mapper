import getMongoMapper from '../../';
import productMocks from '../mocks/products.json';

describe('Counting capabilities of MongoMapper class', () => {
  const mongoMapper = getMongoMapper();
  const productsCollectionName = 'products';

  beforeEach(async () => {
    await mongoMapper.remove(productsCollectionName);
    await mongoMapper.insert(productsCollectionName, productMocks);
  });

  it('counts product by name', async () => {
    const watchParams = { name: 'Apple Watch' };
    const result = await mongoMapper.count(productsCollectionName, watchParams);

    expect(result).toBe(1);
  });

  it("doesn't count anything", async () => {
    const wrongParams = { some: 'lame-paramter' };
    const result = await mongoMapper.count(productsCollectionName, wrongParams);

    expect(result).toBe(0);
  });
});
