# velkaris-core

## Overview

**velkaris-core** is the central backend domain layer and source of truth for business logic in the Velkaris ecosystem—an on-chain marketplace for AI agent capabilities.

This repository contains:

- **Marketplace domain logic** for managing AI skills, memory modules, and capability listings
- **Listing and order lifecycle management** with blockchain verification
- **Seller systems and reviews** with reputation tracking
- **Pricing and fee calculation** with multi-currency support
- **Wallet-based authentication** helpers and authorization
- **Blockchain transaction coordination** for on-chain verification (Base network via viem)
- **Internal orchestration services** for complex workflows

The repository is designed to be consumed by:

- **API Layer** — REST/GraphQL endpoints that expose use cases
- **CLI Tools** — command-line interfaces for administration and batch operations
- **SDKs** — indirect consumption through published interfaces
- **Blockchain Workflows** — coordinated transaction pipelines

## Architecture Philosophy

This project follows **Domain-Driven Design (DDD)** and **Clean Architecture** principles:

- **Domain Layer** — Pure business logic independent of frameworks, untouched by infrastructure concerns
- **Application Layer** — Use cases and orchestrators that coordinate domain logic
- **Infrastructure Layer** — Database, blockchain, cache, and external service adapters
- **Interface Layer** — HTTP routes, event handlers, and background job definitions
- **Shared Layer** — Cross-cutting concerns: types, constants, errors, utilities, logging

## Repository Structure

```
velkaris-core/
├── src/
│   ├── domain/                    # Business logic (entities, rules, interfaces)
│   │   ├── agent/                 # AI Agent domain
│   │   ├── listing/               # Listing domain (skills, capabilities)
│   │   ├── order/                 # Purchase order domain
│   │   ├── seller/                # Seller profile domain
│   │   ├── pricing/               # Pricing and fee calculation
│   │   ├── review/                # Review and rating domain
│   │   └── index.ts
│   ├── application/               # Use cases and orchestration
│   │   ├── use-cases/
│   │   ├── services/
│   │   ├── orchestrators/
│   │   └── index.ts
│   ├── infrastructure/            # External adapters and technical details
│   │   ├── database/
│   │   ├── blockchain/
│   │   ├── cache/
│   │   ├── messaging/
│   │   ├── external/
│   │   └── index.ts
│   ├── interfaces/                # Boundary layers (HTTP, events, jobs)
│   │   ├── http/
│   │   ├── events/
│   │   ├── jobs/
│   │   └── index.ts
│   ├── shared/                    # Cross-cutting utilities
│   │   ├── types/
│   │   ├── constants/
│   │   ├── errors/
│   │   ├── utils/
│   │   ├── logger/
│   │   └── index.ts
│   └── index.ts                   # Main export point
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── scripts/
├── .env.example
├── .gitignore
├── drizzle.config.ts
├── tsconfig.json
├── package.json
└── README.md
```

## Design Principles

### 1. Domain-Driven Design (DDD)

- Business logic lives in the **domain layer**
- Domains are organized by business capability (agent, listing, order, etc.)
- Use cases in the application layer coordinate domain logic
- No application or infrastructure code in domain modules

### 2. Clean Architecture

- **Dependency Inversion**: Domain and application layers define interfaces, infrastructure implements them
- **Repository Pattern**: Data access is abstracted through interfaces
- **Use Cases as Orchestrators**: Each use case is a discrete unit of behavior
- **Separation of Concerns**: Each layer has a single responsibility

### 3. Type Safety

- Strict TypeScript configuration enforces compile-time type safety
- Zod schemas for runtime validation at boundaries
- Discriminated unions for status and type representations
- No `any` types

### 4. Testability

- Domain logic is framework-agnostic and easy to test
- Repository interfaces enable mock implementations
- Use cases can be tested without external dependencies
- Infrastructure adapters are tested separately

## Local Setup

### Prerequisites

- **Node.js** v18 or higher
- **PostgreSQL** 14+

### Installation

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Configure environment variables:**

   ```bash
   cp .env.example .env
   ```

3. **Run database migrations:**

   ```bash
   npm run db:generate
   npm run db:migrate
   ```

## Development Commands

```bash
npm run dev              # Development mode with hot reload
npm run build            # Compile TypeScript
npm run typecheck        # Type checking only
npm run lint             # Run ESLint
npm run test             # Run tests
npm run db:generate      # Generate migrations
npm run db:migrate       # Apply migrations
npm run db:studio        # Open Drizzle Studio
```

## Key Concepts

- **Domain Models**: Entities and value objects representing business concepts
- **Use Cases**: Application-level orchestrators of domain logic
- **Services**: Reusable business logic components
- **Repositories**: Data access abstractions
- **Blockchain Integration**: viem-based contract interaction on Base network
- **Error Handling**: Custom error classes for clean exception handling
- **Logging**: Structured logging with Winston

## License

MIT
