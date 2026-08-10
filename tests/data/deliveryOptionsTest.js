import {getDeliveryOption, calculateDeliveryDate, validDeliveryOption, deliveryOptions} from "../../data/deliveryOptions.js";

describe('test suite: getDeliveryOption', () => {
  it('returns correct delivery option', () => {
    expect(getDeliveryOption('1')).toEqual(deliveryOptions[0]);
    expect(getDeliveryOption('2')).toEqual(deliveryOptions[1]);
    expect(getDeliveryOption('3')).toEqual(deliveryOptions[2]);
  });
  it('returns first delivery option with invalid delivery option id', () => {
    expect(getDeliveryOption('4')).toEqual(deliveryOptions[0]);
  })
});

describe('test suite: calculateDeliveryDate', () => {
  beforeEach(() => {
    jasmine.clock().install();
    jasmine.clock().mockDate(new Date(2026, 7, 10, 12));
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  it('calculates 7 business-day delivery', () => {
    expect(calculateDeliveryDate(deliveryOptions[0]))
        .toBe('Wednesday, August 19');
  });

  it('calculates 3 business-day delivery', () => {
    expect(calculateDeliveryDate(deliveryOptions[1]))
        .toBe('Thursday, August 13');
  });

  it('calculates 1 business-day delivery', () => {
    expect(calculateDeliveryDate(deliveryOptions[2]))
        .toBe('Tuesday, August 11');
  });
});

describe('test suite: validDeliveryOption', () => {
  it('returns true for valid delivery option id', () => {
    expect(validDeliveryOption('1')).toBe(true);
    expect(validDeliveryOption('2')).toBe(true);
    expect(validDeliveryOption('3')).toBe(true);
  });

  it('returns false for invalid delivery option id', () => {
    expect(validDeliveryOption('4')).toBe(undefined);
    expect(validDeliveryOption('5')).toBe(undefined);
  });
});