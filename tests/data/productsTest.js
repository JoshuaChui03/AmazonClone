import {getProducts, Product} from "../../data/products.js";

describe('test suite: getProducts', () => {
  it('existing id in products', () => {
    expect(getProducts('e43638ce-6aa0-4b85-b27f-e1d07eb678c6')).toEqual(new Product({
      id: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
      image: "images/products/athletic-cotton-socks-6-pairs.jpg",
      name: "Black and Gray Athletic Cotton Socks - 6 Pairs",
      rating: {
        stars: 4.5,
        count: 87
      },
      priceCents: 1090,
      keywords: [
        "socks",
        "sports",
        "apparel"
      ]
    }))
  });

  it('non existing id in products', () => {
    expect(getProducts('1')).toEqual(undefined);
  });
});