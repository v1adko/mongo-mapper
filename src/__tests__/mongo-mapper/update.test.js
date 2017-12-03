import getMongoMapper from '../../index';
import productMocks from '../mocks/products.json';

describe('Update capabilities of MongoMapper class', () => {
  const mongoMapper = getMongoMapper();
  const productsCollectionName = 'products';

  const replacement = {
    name: 'Apple Watch',
    price: 999
  };

  beforeEach(async () => {
    await mongoMapper.replace(productsCollectionName, productMocks);
  });

  it('updates one record', async () => {
    const product = await mongoMapper.update(
      productsCollectionName,
      { name: productMocks[0].name },
      replacement
    );
    
    expect(product).toBeTruthy();
    expect(product._id).toBeFalsy();
    expect(product).toBeInstanceOf(Object);
    expect(product.name).toBe(replacement.name);
    expect(product.price).toBe(replacement.price);

    const updatedProduct = await mongoMapper.findOne(productsCollectionName, {
      id: product.id
    });
    expect(product).toEqual(updatedProduct);
  });

  it('updates all records', async () => {
    const minimalRating = 70;
    const setRating = 100;
    const updatedCount = await mongoMapper.updateAll(
      productsCollectionName,
      { rating: { $gt: minimalRating } },
      { rating: setRating }
    );
    const count = productMocks.reduce(
      (prev, curr) => prev + +(curr.rating > minimalRating),
      0
    );

    expect(updatedCount).toBeGreaterThan(0);
    expect(updatedCount).toBe(count);

    const ids = productMocks
      .filter(({ rating }) => rating > minimalRating)
      .map(({ id }) => id);
    const products = await mongoMapper.find(productsCollectionName);
    const updatedProductRatings = products
      .filter(({ id }) => ids.indexOf(id) !== -1)
      .map(({ rating }) => rating);

    expect(updatedProductRatings).toEqual(
      new Array(updatedCount).fill(setRating)
    );
  });
});
