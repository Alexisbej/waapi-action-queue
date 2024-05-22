import { Credit } from '../models';
import { calculateCredits } from './calculateCredits';
import { CREDIT_RECALCULATION_TIMEOUT } from './consts';

describe('calculateCredits', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should not recalculate credits if the elapsed time is less than the timeout', () => {
    const credit: Credit = {
      type: 'A',
      value: 5,
      max: 10,
      lastUpdated: new Date(),
    };

    const result = calculateCredits(credit);

    expect(result.value).toBe(credit.value);
    expect(result.lastUpdated).toEqual(credit.lastUpdated);
  });

  it('should recalculate credits if the elapsed time is more than the timeout', () => {
    const credit: Credit = {
      type: 'A',
      value: 5,
      max: 10,
      lastUpdated: new Date(
        new Date().getTime() - (CREDIT_RECALCULATION_TIMEOUT + 1000)
      ),
    };

    const creditCopy = { ...credit };

    const result = calculateCredits(credit);

    expect(result.value).toBeGreaterThanOrEqual(8);
    expect(result.value).toBeLessThanOrEqual(10);
    expect(result.lastUpdated).not.toEqual(creditCopy.lastUpdated);
  });

  it('should update the lastUpdated property when recalculating credits', () => {
    const credit: Credit = {
      type: 'A',
      value: 5,
      max: 10,
      lastUpdated: new Date(
        new Date().getTime() - (CREDIT_RECALCULATION_TIMEOUT + 1000)
      ),
    };
    const creditCopy = { ...credit };

    const result = calculateCredits(credit);

    expect(result.lastUpdated).not.toEqual(creditCopy.lastUpdated);
    expect(result.lastUpdated.getTime()).toBeCloseTo(new Date().getTime(), -2);
  });

  it('should keep the same lastUpdated property when not recalculating credits', () => {
    const credit: Credit = {
      type: 'A',
      value: 5,
      max: 10,
      lastUpdated: new Date(),
    };

    const result = calculateCredits(credit);

    expect(result.lastUpdated).toEqual(credit.lastUpdated);
  });
});
