import {
  getProduct,
  Product,
  Clothing,
  Appliance,
  loadProductsFetch
} from '../../data/products.js';
import {installApiMock} from '../helpers/mockApi.js';
import {
  applianceProductId,
  clothingProductId,
  productId1,
  testProducts
} from '../helpers/testData.js';

describe('test suite: getProduct', () => {
  beforeEach(async () => {
    installApiMock({products: testProducts});
    await loadProductsFetch();
  });

  it('gets an existing product by id', () => {
    const product = getProduct(productId1);

    expect(product.id).toEqual(productId1);
    expect(product.name).toEqual('Black and Gray Athletic Cotton Socks - 6 Pairs');
    expect(product.priceCents).toEqual(1090);
  });

  it('returns undefined for a non-existing id', () => {
    expect(getProduct('1')).toBeUndefined();
  });
});

describe('test suite: Product', () => {
  let product;

  beforeEach(() => {
    product = new Product({
      id: productId1,
      image: 'images/products/athletic-cotton-socks-6-pairs.jpg',
      name: 'Black and Gray Athletic Cotton Socks - 6 Pairs',
      rating: {
        stars: 4.5,
        count: 87
      },
      priceCents: 1090,
      keywords: ['socks', 'sports', 'apparel']
    });
  });

  it('has the correct properties', () => {
    expect(product.id).toEqual(productId1);
    expect(product.image).toEqual('images/products/athletic-cotton-socks-6-pairs.jpg');
    expect(product.name).toEqual('Black and Gray Athletic Cotton Socks - 6 Pairs');
    expect(product.rating).toEqual({stars: 4.5, count: 87});
    expect(product.priceCents).toEqual(1090);
  });

  it('gets the stars url', () => {
    expect(product.getStarsUrl()).toEqual('images/ratings/rating-45.png');
  });

  it('gets the price', () => {
    expect(product.getPrice()).toEqual('$10.90');
  });

  it('does not display any extra info', () => {
    expect(product.extraInfoHtml()).toEqual('');
  });
});

describe('test suite: Clothing', () => {
  let clothing;

  beforeEach(() => {
    clothing = new Clothing({
      id: clothingProductId,
      image: 'images/products/adults-plain-cotton-tshirt-2-pack-teal.jpg',
      name: 'Adults Plain Cotton T-Shirt - 2 Pack',
      rating: {stars: 4.5, count: 56},
      priceCents: 799,
      keywords: ['tshirts', 'apparel', 'mens'],
      type: 'clothing',
      sizeChartLink: 'images/clothing-size-chart.png'
    });
  });

  it('has the correct properties', () => {
    expect(clothing.id).toEqual(clothingProductId);
    expect(clothing.image).toEqual('images/products/adults-plain-cotton-tshirt-2-pack-teal.jpg');
    expect(clothing.sizeChartLink).toEqual('images/clothing-size-chart.png');
  });

  it('gets the stars url', () => {
    expect(clothing.getStarsUrl()).toEqual('images/ratings/rating-45.png');
  });

  it('gets the price', () => {
    expect(clothing.getPrice()).toEqual('$7.99');
  });

  it('displays a size chart link in extraInfoHtml', () => {
    expect(clothing.extraInfoHtml()).toContain(
      '<a href="images/clothing-size-chart.png" target="_blank">'
    );
    expect(clothing.extraInfoHtml()).toContain('Size chart');
  });
});

describe('test suite: Appliance', () => {
  let appliance;

  beforeEach(() => {
    appliance = new Appliance({
      id: applianceProductId,
      image: 'images/products/black-2-slot-toaster.jpg',
      name: '2 Slot Toaster - Black',
      rating: {stars: 5, count: 2197},
      priceCents: 1899,
      keywords: ['toaster', 'kitchen', 'appliances'],
      type: 'appliance',
      instructionsLink: 'images/appliance-instructions.png',
      warrantyLink: 'images/appliance-warranty.png'
    });
  });

  it('has the correct properties', () => {
    expect(appliance.id).toEqual(applianceProductId);
    expect(appliance.image).toEqual('images/products/black-2-slot-toaster.jpg');
    expect(appliance.instructionsLink).toEqual('images/appliance-instructions.png');
    expect(appliance.warrantyLink).toEqual('images/appliance-warranty.png');
  });

  it('gets the stars url', () => {
    expect(appliance.getStarsUrl()).toEqual('images/ratings/rating-50.png');
  });

  it('gets the price', () => {
    expect(appliance.getPrice()).toEqual('$18.99');
  });

  it('displays instructions and warranty in extraInfoHtml', () => {
    expect(appliance.extraInfoHtml()).toContain(
      '<a href="images/appliance-instructions.png" target="_blank">'
    );
    expect(appliance.extraInfoHtml()).toContain('Instructions');
    expect(appliance.extraInfoHtml()).toContain(
      '<a href="images/appliance-warranty.png" target="_blank">'
    );
    expect(appliance.extraInfoHtml()).toContain('Warranty');
  });
});
