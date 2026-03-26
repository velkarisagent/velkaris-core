export function calculatePercentage(value: number, percentage: number): number {
  return (value * percentage) / 100;
}

export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function formatEthAddress(address: string): string {
  if (address.length < 10) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxAttempts: number = 3,
  initialDelayMs: number = 1000,
): Promise<T> {
  let lastError: Error | null = null;

  for (let i = 0; i < maxAttempts; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      if (i < maxAttempts - 1) {
        const delayMs = initialDelayMs * Math.pow(2, i);
        await delay(delayMs);
      }
    }
  }

  throw lastError || new Error('Max retry attempts reached');
}
