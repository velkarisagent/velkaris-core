import { describe, it, expect } from 'vitest';
import { validateWithZod, isValidAddress, normalizeAddress } from '../../src/shared/utils';
import { ValidationError } from '../../src/shared/errors';
import { z } from 'zod';

describe('Validation Utilities', () => {
  it('should validate with zod schema', () => {
    const schema = z.object({
      name: z.string(),
      age: z.number().positive(),
    });

    const valid = validateWithZod(schema, { name: 'John', age: 30 });
    expect(valid.name).toBe('John');
    expect(valid.age).toBe(30);
  });

  it('should throw ValidationError on schema mismatch', () => {
    const schema = z.object({
      email: z.string().email(),
    });

    expect(() => {
      validateWithZod(schema, { email: 'not-an-email' });
    }).toThrow(ValidationError);
  });

  it('should validate Ethereum addresses', () => {
    expect(isValidAddress('0x1234567890123456789012345678901234567890')).toBe(true);
    expect(isValidAddress('0x123')).toBe(false);
    expect(isValidAddress('not-an-address')).toBe(false);
  });

  it('should normalize addresses to lowercase', () => {
    const normalized = normalizeAddress('0xABCDEF1234567890123456789012345678901234');
    expect(normalized).toBe('0xabcdef1234567890123456789012345678901234');
  });
});
