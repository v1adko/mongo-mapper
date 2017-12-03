import getMongoMapper from '../../';
import productMocks from '../mocks/products.json';

describe('Creation capabilities of MongoMapper class', () => {
  const mongoMapper = getMongoMapper();
  const productsCollectionName = 'products';

  const iPad = {
    name: 'iPad',
    price: 959
  };

  beforeEach(async () => {
    await mongoMapper.clearCollection(productsCollectionName);
  });

  it('inserts one document in product collection', async () => {
    await mongoMapper.insert(productsCollectionName, iPad);

    const [product] = await mongoMapper.find(productsCollectionName, {
      name: 'iPad'
    });

    expect(product.name).toBe(iPad.name);
  });

  it('inserts many documents in product collection', async () => {
    await mongoMapper.insert(productsCollectionName, productMocks);

    const products = await mongoMapper.find(productsCollectionName);

    expect(products.length).toBe(productMocks.length);
  });
});
