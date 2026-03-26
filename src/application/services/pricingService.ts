import { PricingCalculator } from '@domain/pricing';
import { logger } from '@shared/logger';

export class PricingService {
  private calculator: PricingCalculator;

  constructor(initialEthRate: number = 2500) {
    this.calculator = new PricingCalculator(initialEthRate);
  }

  updateExchangeRate(ethRate: number) {
    logger.info('Updating ETH exchange rate', { ethRate });
    this.calculator.setEthRate(ethRate);
  }

  calculatePrice(usdAmount: number) {
    return this.calculator.calculateQuote({ usdAmount });
  }
}
