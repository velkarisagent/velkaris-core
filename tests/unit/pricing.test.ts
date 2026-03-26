import { describe, it, expect } from 'vitest';
import { PricingCalculator } from '../../src/domain/pricing';

describe('PricingCalculator', () => {
  it('should calculate pricing quote correctly', () => {
    const calculator = new PricingCalculator(2500); // $2500 per ETH

    const quote = calculator.calculateQuote({
      usdAmount: 100,
    });

    expect(quote.priceUsd).toBe(100);
    expect(quote.priceEth).toBe(0.04); // 100 / 2500
    expect(quote.platformFeeEth).toBeGreaterThan(0);
    expect(quote.sellerPayoutEth).toBeLessThan(quote.priceEth);
  });

  it('should respect platform and seller fee percentages', () => {
    const calculator = new PricingCalculator(1000);

    const quote = calculator.calculateQuote({
      usdAmount: 500,
    });

    const total =
      quote.platformFeeEth + quote.sellerPayoutEth;
    expect(total).toBeCloseTo(quote.priceEth, 10);
  });
});
