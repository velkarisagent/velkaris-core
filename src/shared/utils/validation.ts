import { z } from 'zod';
import { ValidationError } from '@shared/errors';

export function validateWithZod<T>(schema: z.ZodSchema<T>, data: unknown): T {
  try {
    return schema.parse(data);
  } catch (e) {
    if (e instanceof z.ZodError) {
      const errors = e.errors.map(err => ({
        path: err.path.join('.'),
        message: err.message,
        code: err.code,
      }));
      throw new ValidationError('Validation failed', { errors });
    }
    throw e;
  }
}

export function isValidAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

export function normalizeAddress(address: string): string {
  if (!isValidAddress(address)) {
    throw new ValidationError('Invalid Ethereum address', { address });
  }
  return address.toLowerCase();
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
