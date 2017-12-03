import getMongoMapper from '../../';
import productMocks from '../mocks/products.json';

describe('Query capabilities of MongoMapper class', () => {
  const mongoMapper = getMongoMapper();
  const productsCollectionName = 'products';

  beforeEach(async () => {
    await mongoMapper.remove(productsCollectionName);
    await mongoMapper.insert(productsCollectionName, productMocks);
  });

  it('tests is query is Array', async () => {
    const products = await mongoMapper.find(productsCollectionName);

    expect(products).toBeInstanceOf(Array);
    expect(products.length).toBe(6);
  });

  it('loads test product by name', async () => {
    const watchParams = { name: 'Apple Watch' };
    const [watch] = await mongoMapper.find(productsCollectionName, watchParams);

    expect(watch.name).toBe(watchParams.name);
  });

  it("doesn't load anything", async () => {
    const wrongParams = { some: 'lame-paramter' };
    const products = await mongoMapper.find(
      productsCollectionName,
      wrongParams
    );

    expect(products.length).toBe(0);
  });

  it('find one document', async () => {
    const watchParams = { name: 'Apple Watch' };
    const watch = await mongoMapper.findOne(
      productsCollectionName,
      watchParams
    );

    expect(watch.name).toBe(watchParams.name);
  });
});
