import { PLATFORM_FEE_PERCENTAGE } from '@shared/constants';
import { PriceQuote, PricingRequest } from './types';

export class PricingCalculator {
  private currentEthRate: number;

  constructor(ethRate: number = 2500) {
    this.currentEthRate = ethRate;
  }

  setEthRate(ethRate: number): void {
    this.currentEthRate = ethRate;
  }

  calculateQuote(request: PricingRequest): PriceQuote {
    const priceUsd = request.usdAmount;
    const priceEth = this.usdToEth(priceUsd);
    const platformFeeEth = this.calculatePlatformFee(priceEth);
    const sellerPayoutEth = this.calculateSellerPayout(priceEth, platformFeeEth);

    return {
      priceUsd,
      priceEth,
      platformFeeEth,
      sellerPayoutEth,
      exchangeRate: this.currentEthRate,
    };
  }

  private usdToEth(usdAmount: number): number {
    return usdAmount / this.currentEthRate;
  }

  private calculatePlatformFee(ethAmount: number): number {
    return (ethAmount * PLATFORM_FEE_PERCENTAGE);
  }

  private calculateSellerPayout(
    ethAmount: number,
    platformFeeEth: number,
  ): number {
    return ethAmount - platformFeeEth;
  }
}
