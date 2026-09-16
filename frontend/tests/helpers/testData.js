export const productId1 = '6aa7b605df8996a26403ab0a';
export const productId2 = '6aa7b605df8996a26403ab0b';
export const clothingProductId = '6aa7b605df8996a26403ab0c';
export const applianceProductId = '6aa7b605df8996a26403ab0d';

export const testProducts = [
  {
    _id: productId1,
    image: 'images/products/athletic-cotton-socks-6-pairs.jpg',
    name: 'Black and Gray Athletic Cotton Socks - 6 Pairs',
    rating: {
      stars: 4.5,
      count: 87
    },
    priceCents: 1090,
    keywords: ['socks', 'sports', 'apparel']
  },
  {
    _id: productId2,
    image: 'images/products/intermediate-composite-basketball.jpg',
    name: 'Intermediate Size Basketball',
    rating: {
      stars: 4,
      count: 127
    },
    priceCents: 2095,
    keywords: ['sports', 'basketballs']
  },
  {
    _id: clothingProductId,
    image: 'images/products/adults-plain-cotton-tshirt-2-pack-teal.jpg',
    name: 'Adults Plain Cotton T-Shirt - 2 Pack',
    rating: {
      stars: 4.5,
      count: 56
    },
    priceCents: 799,
    keywords: ['tshirts', 'apparel', 'mens'],
    type: 'clothing',
    sizeChartLink: 'images/clothing-size-chart.png'
  },
  {
    _id: applianceProductId,
    image: 'images/products/black-2-slot-toaster.jpg',
    name: '2 Slot Toaster - Black',
    rating: {
      stars: 5,
      count: 2197
    },
    priceCents: 1899,
    keywords: ['toaster', 'kitchen', 'appliances'],
    type: 'appliance',
    instructionsLink: 'images/appliance-instructions.png',
    warrantyLink: 'images/appliance-warranty.png'
  }
];

export function defaultTestCart() {
  return [
    {
      productId: productId1,
      quantity: 2,
      deliveryOptionId: '1'
    },
    {
      productId: productId2,
      quantity: 1,
      deliveryOptionId: '2'
    }
  ];
}
