# Velkaris-Core Architecture Guide

## Overview

This document provides a comprehensive guide to the `velkaris-core` repository architecture, design decisions, and best practices for development.

## The Five-Layer Architecture

### 1. Domain Layer (`src/domain/`)

The domain layer is the heart of the application. It contains:

- **Business Rules**: Pure logic unaware of any framework
- **Entities and Value Objects**: Core domain concepts (Agent, Listing, Order, Seller, Review)
- **Repository Interfaces**: Contracts for data persistence
- **DTOs**: Data transfer objects for cross-layer communication

**Key Principle**: Domain logic is 100% framework-agnostic and can be tested in isolation.

**Domain Modules**:

- `agent/` — AI agent capability definitions
- `listing/` — Marketplace listing domain logic
- `order/` — Purchase order lifecycle
- `seller/` — Seller profile and reputation
- `pricing/` — Fee and price calculations
- `review/` — Customer reviews and ratings

**Example Domain Workflow**:

```typescript
// Create an order (domain logic only)
const order = Order.create(buyerId, sellerId, listingId, agentId, price, paymentEth, platformFee, sellerPayout);

// Order lifecycle is managed by domain entity methods
order.recordPayment(txHash, blockNumber);  // Transitions to PAID state
order.moveToInProgress();                   // Transitions to IN_PROGRESS
order.complete();                           // Transitions to COMPLETED
```

### 2. Application Layer (`src/application/`)

The application layer orchestrates domain logic and coordinates between domains:

- **Use Cases**: Entry points for specific business operations
- **Services**: Reusable business logic components
- **Orchestrators**: Complex multi-step workflows
- **DTOs**: Input/output models for use cases

**Use Cases** are the primary abstractions:

- Each use case is a discrete unit of work
- Input is a DTO, output is a result object
- Use cases call domain entities and repositories
- Use cases publish domain events

**Example Use Case**:

```typescript
class CreateListingUseCase {
  constructor(
    private listingRepository: IListingRepository,
    private sellerRepository: ISellerRepository,
  ) {}

  async execute(input: CreateListingInput): Promise<CreateListingOutput> {
    // Validate input
    validateWithZod(createListingSchema, input);

    // Verify seller exists (repository query)
    const seller = await this.sellerRepository.findById(input.sellerId);
    if (!seller) throw new NotFoundError('Seller', input.sellerId);

    // Create domain entity
    const listing = Listing.create(...);

    // Persist (repository command)
    await this.listingRepository.save(listing);

    // Return result
    return { listingId: listing.getId(), ... };
  }
}
```

### 3. Infrastructure Layer (`src/infrastructure/`)

The infrastructure layer adapts domain and application logic to technical concerns:

- **Database**: Drizzle ORM repositories, schema definitions
- **Blockchain**: viem client wrapper, transaction coordination
- **Cache**: In-memory or Redis cache adapter
- **Messaging**: Event bus for domain events
- **Configuration**: Environment-based app config

**Key Principle**: Infrastructure implementations depend on domain interfaces, not vice versa.

**Database Pattern**:

```typescript
// Domain interface (independent of infrastructure)
export interface IListingRepository {
  save(listing: Listing): Promise<void>;
  findById(id: string): Promise<Listing | null>;
  findBySellerId(sellerId: string): Promise<Listing[]>;
}

// Infrastructure implementation
export class ListingRepository implements IListingRepository {
  async save(listing: Listing): Promise<void> {
    const props = listing.toPersistence();
    await db.insert(listingsTable).values({ ... });
  }

  async findById(id: string): Promise<Listing | null> {
    const row = await db.select().from(listingsTable).where(...);
    return row.length > 0 ? Listing.fromPersistence(row[0]) : null;
  }

  // ... other methods
}
```

### 4. Interface Layer (`src/interfaces/`)

The interface layer provides boundary entry points:

- **HTTP**: REST endpoints (route definitions and controllers)
- **Events**: Domain event handlers for side effects
- **Jobs**: Scheduled background jobs

HTTP routes map to use cases:

```typescript
export const routes: HttpRouteHandler[] = [
  {
    method: 'POST',
    path: '/orders',
    handler: async (purchaseListingUseCase, input) => {
      return purchaseListingUseCase.execute(input);
    },
  },
  // ... more routes
];
```

### 5. Shared Layer (`src/shared/`)

Cross-cutting utilities and concerns:

- **Types**: Common types and interfaces
- **Constants**: Configuration constants
- **Errors**: Custom error classes with context
- **Utils**: Validation, helpers, type-safe utilities
- **Logger**: Structured logging with Winston

**Custom Error Classes**:

```typescript
new ValidationError('Invalid input', { fields: ['email'] });    // 400
new NotFoundError('User', userId);                               // 404
new UnauthorizedError('No access token provided');               // 401
new ConflictError('Email already registered');                   // 409
new InternalServerError('Database connection failed');           // 500
```

## Dependency Graph

```
         Interfaces (HTTP, Events, Jobs)
              ↓
         Application (Use Cases, Services)
              ↓
Domain (Entities, Repositories) ← Infrastructure (Repositories, DB)
              ↓
          Shared (Errors, Utils, Logger)
```

**Key Rule**: Dependencies flow downward only. Domain and Application layers never depend on Infrastructure.

## Design Patterns

### 1. Repository Pattern

Repositories abstract data access behind interfaces defined in the domain:

```typescript
// Domain defines the interface
export interface IOrderRepository {
  save(order: Order): Promise<void>;
  findById(id: string): Promise<Order | null>;
  findByBuyerId(buyerId: string): Promise<Order[]>;
}

// Infrastructure implements it with Drizzle
export class OrderRepository implements IOrderRepository {
  // ... implementation with drizzle-orm
}
```

### 2. Entity Pattern

Domain entities encapsulate business logic:

```typescript
export class Order {
  private props: OrderProps;

  // Static factory
  static create(...): Order { ... }

  // Queries
  getStatus(): OrderStatus { ... }
  isPaid(): boolean { ... }

  // Commands (state mutations)
  recordPayment(txHash: string, blockNumber: number): void { ... }
  moveToInProgress(): void { ... }
  complete(): void { ... }

  // Persistence helper
  toPersistence(): OrderProps { ... }
}
```

### 3. Use Case Pattern

Each use case is a discrete, testable unit of work:

```typescript
export class PurchaseListingUseCase {
  constructor(
    private orderRepository: IOrderRepository,
    private listingRepository: IListingRepository,
    private sellerRepository: ISellerRepository,
  ) {}

  async execute(input: PurchaseListingInput): Promise<PurchaseListingOutput> {
    // 1. Validate
    // 2. Query (repositories)
    // 3. Create/Update domain entities
    // 4. Persist (repositories)
    // 5. Publish events
    // 6. Return result
  }
}
```

### 4. Service Pattern

Services contain reusable business logic:

```typescript
export class PricingService {
  private calculator: PricingCalculator;

  updateExchangeRate(ethRate: number) { ... }
  calculatePrice(usdAmount: number) { ... }
}
```

### 5. Value Object Pattern

Immutable, equality-based objects without identity:

```typescript
export interface PriceQuote {
  priceUsd: number;
  priceEth: number;
  platformFeeEth: number;
  sellerPayoutEth: number;
  exchangeRate: number;
}
```

## Error Handling Strategy

Errors are typed and contextual:

```typescript
try {
  // ... operation
} catch (error) {
  if (error instanceof ValidationError) {
    // 400 Bad Request
  } else if (error instanceof NotFoundError) {
    // 404 Not Found
  } else if (error instanceof UnauthorizedError) {
    // 401 Unauthorized
  } else if (error instanceof ConflictError) {
    // 409 Conflict
  } else {
    // 500 Internal Server Error
  }
}
```

## Event-Driven Architecture

Domain events enable loose coupling and side effects:

```typescript
// Events are published from use cases
await eventBus.publish({
  id: uuidv4(),
  type: DOMAIN_EVENTS.ORDER_CREATED,
  aggregateId: order.getId(),
  timestamp: new Date(),
  data: { orderId, buyerId, sellerId, priceEth },
});

// Handlers consume events asynchronously
export class OrderCreatedEventHandler implements EventSubscriber {
  async handle(event: OrderCreatedEvent): Promise<void> {
    // Send notifications, update caches, etc.
  }
}
```

## Testing Strategy

### Unit Tests

Test domain logic in isolation (no database, no external services):

```typescript
describe('Order Domain Entity', () => {
  it('should create order in pending payment state', () => {
    const order = Order.create(...);
    expect(order.getStatus()).toBe(OrderStatus.PENDING_PAYMENT);
  });

  it('should transition through order lifecycle', () => {
    order.recordPayment(txHash, blockNumber);
    expect(order.getStatus()).toBe(OrderStatus.PAID);
  });
});
```

### Integration Tests

Test repositories and services with a test database:

```typescript
describe('OrderRepository', () => {
  it('should save and retrieve orders', async () => {
    const order = Order.create(...);
    await repository.save(order);
    const retrieved = await repository.findById(order.getId());
    expect(retrieved).toEqual(order);
  });
});
```

### E2E Tests

Test complete workflows through all layers:

```typescript
describe('Purchase Flow', () => {
  it('should complete full purchase workflow', async () => {
    // 1. Create listing
    // 2. Purchase listing
    // 3. Process payment
    // 4. Verify order state
  });
});
```

## Development Workflow

1. **Define domain logic** in `src/domain/`
2. **Implement repository interface** in `src/infrastructure/database/repositories/`
3. **Create use case** in `src/application/use-cases/`
4. **Add HTTP route** in `src/interfaces/http/`
5. **Handle events** in `src/interfaces/events/`
6. **Write tests** in `tests/`

## Configuration Management

Configuration is validated at startup using Zod:

```typescript
const config = getConfig(); // Throws if invalid

config.nodeEnv;                     // 'development' | 'production' | 'test'
config.databaseUrl;                 // PostgreSQL URL
config.baseRpcUrl;                  // Base network RPC
config.enableBlockchainVerification; // Feature flag
config.logLevel;                    // 'error' | 'warn' | 'info' | 'debug'
```

## Scaling Considerations

### Database

- **Migrations**: Use `npm run db:generate` to create migrations
- **Indexing**: Add indexes for frequently queried fields
- **Transactions**: Use Drizzle transactions for atomic operations
- **Connection pooling**: Configured via database connection string

### Blockchain

- **Retries**: `retryWithBackoff` utility handles network flakiness
- **Confirmation**: Wait for required block confirmations
- **Gas Optimization**: Batch operations where possible

### Caching

- **Listings**: Cache frequently accessed listings
- **Seller Ratings**: Cache aggregated ratings
- **Exchange Rates**: Cache ETH/USD rates with TTL

### Background Jobs

- **Settlement Processing**: Periodic settlement of escrow
- **Rating Aggregation**: Recalculate seller/listing ratings
- **Reputation Updates**: Update seller reputation scores
- **Transaction Verification**: Confirm on-chain transactions

## Security Considerations

1. **Input Validation**: All external inputs validated with Zod
2. **Error Messages**: Never expose sensitive system details in errors
3. **Logging**: PII not logged; use IDs instead of addresses where possible
4. **Database**: Use parameterized queries (Drizzle provides this)
5. **Blockchain**: Verify contract addresses before transactions
6. **Rate Limiting**: Add at API gateway level (not in core)

## Production Deployment

1. Set `NODE_ENV=production`
2. Configure all required environment variables
3. Run `npm run db:migrate` to apply schema migrations
4. Start application with `npm start`
5. Monitor logs in `logs/` directory
6. Set up log shipping (CloudWatch, Datadog, etc.)
