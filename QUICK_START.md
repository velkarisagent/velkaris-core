# Velkaris-Core Quick Start Guide

## Installation

### 1. Install Dependencies

```bash
npm install
```

This installs:

- **TypeScript**: Strict type checking
- **Drizzle ORM**: Type-safe PostgreSQL queries
- **Zod**: Runtime validation
- **viem**: Blockchain client for Base network
- **Winston**: Structured logging
- **Vitest**: Testing framework
- **ESLint**: Code linting

### 2. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` with your settings:

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/velkaris_dev

# Node environment
NODE_ENV=development

# Blockchain
BASE_RPC_URL=https://mainnet.base.org
BASE_CHAIN_ID=8453

# Logging
LOG_LEVEL=debug

# Feature flags
ENABLE_BLOCKCHAIN_VERIFICATION=true
```

### 3. Initialize Database

```bash
# Generate schema migrations
npm run db:generate

# Apply migrations
npm run db:migrate

# Seed sample data (optional)
npm run db:seed
```

## Development

### Start Development Server

```bash
npm run dev
```

Runs with hot reload using `tsx`.

### Type Checking

```bash
npm run typecheck
```

Checks TypeScript types without compiling. Use this in CI/CD.

### Linting

```bash
npm run lint
```

Runs ESLint with automatic fixes for style issues.

### Testing

```bash
# Run all tests once
npm run test

# Watch mode (re-run on file changes)
npm run test:watch

# UI dashboard
npm run test:ui
```

### Building for Production

```bash
npm run typecheck  # Verify no type errors
npm run lint       # Verify code style
npm run test       # Verify tests pass
npm run build      # Compile TypeScript
```

Output goes to `dist/` directory.

## Project Structure

```
velkaris-core/
├── src/
│   ├── domain/            # Business logic (6 domains)
│   ├── application/       # Use cases, services, orchestrators
│   ├── infrastructure/    # Database, blockchain, cache, config
│   ├── interfaces/        # HTTP routes, event handlers, jobs
│   ├── shared/            # Types, errors, utilities, logging
│   └── index.ts           # Main export point
├── tests/
│   ├── unit/              # Domain and utility tests
│   ├── integration/       # Repository and service tests
│   └── e2e/               # Complete workflow tests
├── scripts/
│   ├── migrate.ts         # Database migrations
│   ├── seed.ts            # Database seeding
│   └── health-check.ts    # Health check utility
├── package.json
├── tsconfig.json
├── drizzle.config.ts
├── vitest.config.ts
├── .eslintrc.json
├── .env.example
└── README.md
```

## Key Files to Understand

### Domain Layer

- `src/domain/order/entities.ts` — Order aggregate root with lifecycle
- `src/domain/listing/entities.ts` — Listing aggregate
- `src/domain/pricing/calculator.ts` — Fee calculation logic
- `src/domain/*/repository.interface.ts` — Data access contracts

### Application Layer

- `src/application/use-cases/order/purchaseListing.ts` — Example use case
- `src/application/services/pricingService.ts` — Business service
- `src/application/orchestrators/purchaseOrchestrator.ts` — Complex workflow

### Infrastructure Layer

- `src/infrastructure/database/repositories/*.ts` — Data access implementations
- `src/infrastructure/blockchain/viemClient.ts` — Blockchain client
- `src/infrastructure/external/config.ts` — Configuration management

### Shared Layer

- `src/shared/errors/customErrors.ts` — Error hierarchy
- `src/shared/utils/validation.ts` — Input validation
- `src/shared/logger/logger.ts` — Structured logging

## Common Tasks

### Adding a New Domain

1. Create `src/domain/{domainName}/` directory
2. Define entities in `entities.ts`
3. Define repository interface in `repository.interface.ts`
4. Export from `index.ts`
5. Create repository implementation in `src/infrastructure/database/repositories/`

### Adding a New Use Case

1. Create `src/application/use-cases/{domain}/{useCaseName}.ts`
2. Define input/output types
3. Inject repositories via constructor
4. Implement execute method
5. Export from `index.ts`
6. Add HTTP route if needed

### Adding a New Endpoint

1. Add route to `src/interfaces/http/routes.ts`
2. Create controller method if needed  
3. Call use case from controller/route handler
4. Map result to HTTP response
5. Add error handling

### Creating a Database Migration

1. Update schema file in `src/infrastructure/database/schema/`
2. Run `npm run db:generate`
3. Review generated migration in `drizzle/` folder
4. Run `npm run db:migrate` to apply
5. Commit both schema and migration

### Debugging Database Queries

Open Drizzle Studio to inspect database:

```bash
npm run db:studio
```

Accessible at `http://localhost:3000` (or console output URL).

## Best Practices

### 1. Keep Domain Clean

- Domain entities have no framework dependencies
- Business rules live in domain, not in services
- Repository interfaces are domain concepts  

### 2. Use Type Safety

```typescript
// ✅ Good: Discriminated union
type Result<T> = { success: true; data: T } 
               | { success: false; error: AppError };

// ❌ Bad: Error thrown, no type safety
throw new Error('Something failed');
```

### 3. Validate at Boundaries

```typescript
// ✅ Good: Validate input at use case entry
export class MyUseCase {
  async execute(input: MyInput): Promise<MyOutput> {
    const validated = validateWithZod(mySchema, input);
    // ... safe to use validated
  }
}

// ❌ Bad: Assume input is valid
```

### 4. Use Structured Logging

```typescript
// ✅ Good: Context included
logger.info('Order created', { 
  orderId: order.getId(), 
  buyerId: order.getBuyerId(),
  amount: order.getPriceEth(),
});

// ❌ Bad: Vague messages
console.log('order created');
```

### 5. Testable Code

```typescript
// ✅ Good: Dependencies injected
class OrderService {
  constructor(private orderRepository: IOrderRepository) {}
}

// ❌ Bad: Hard dependencies
class OrderService {
  private repo = new OrderRepository(); // Tightly coupled
}
```

## Troubleshooting

### Database Connection Failed

```bash
# Check connection string
echo $DATABASE_URL

# Verify PostgreSQL is running
psql -d "YOUR_DATABASE_URL"

# Check migration status  
npm run db:studio
```

### TypeScript Compilation Errors

```bash
# See all type errors
npm run typecheck

# Ensure tsconfig.json paths are correct
cat tsconfig.json | grep -A 5 '"paths"'
```

### Import Path Errors

Check path aliases in `tsconfig.json`. They should match actual directory structure:

```json
{
  "paths": {
    "@domain/*": ["domain/*"],
    "@application/*": ["application/*"],
    "@infrastructure/*": ["infrastructure/*"],
    "@shared/*": ["shared/*"]
  }
}
```

### Tests Failing

```bash
# Run with verbose output
npm run test -- --reporter=verbose

# Run specific test file
npm run test -- tests/unit/order.test.ts

# Debug a test
npm run test -- --inspect-brk
```

## Next Steps

1. **Set up API Layer**: Create a separate `api` repository that imports this core
2. **Deploy**: Set up CI/CD pipeline that runs type-check, lint, and tests
3. **Monitor**: Set up log aggregation and error tracking
4. **Document**: Add API documentation once endpoints are implemented
5. **Scale**: Consider caching, async jobs, and event streaming as it grows

## Support

For architectural questions, consult:

- `ARCHITECTURE.md` — Detailed design patterns and trade-offs
- `README.md` — Project overview and setup
- `src/domain/*/index.ts` — Domain modules and their responsibilities
- Test files — Examples of how to use each module

## License

MIT
