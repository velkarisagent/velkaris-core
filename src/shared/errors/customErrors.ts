export class AppError extends Error {
  constructor(
    public readonly message: string,
    public readonly code: string,
    public readonly statusCode: number = 500,
    public readonly context?: Record<string, unknown>,
  ) {
    super(message);
    this.name = 'AppError';
    Object.setPrototypeOf(this, AppError.prototype);
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      statusCode: this.statusCode,
      context: this.context,
    };
  }
}

export class ValidationError extends AppError {
  constructor(
    message: string,
    context?: Record<string, unknown>,
  ) {
    super(message, 'VALIDATION_ERROR', 400, context);
    this.name = 'ValidationError';
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}

export class NotFoundError extends AppError {
  constructor(
    resource: string,
    id?: string | number,
  ) {
    const message = id ? `${resource} with id ${id} not found` : `${resource} not found`;
    super(message, 'NOT_FOUND', 404, { resource, id });
    this.name = 'NotFoundError';
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized', context?: Record<string, unknown>) {
    super(message, 'UNAUTHORIZED', 401, context);
    this.name = 'UnauthorizedError';
    Object.setPrototypeOf(this, UnauthorizedError.prototype);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Forbidden', context?: Record<string, unknown>) {
    super(message, 'FORBIDDEN', 403, context);
    this.name = 'ForbiddenError';
    Object.setPrototypeOf(this, ForbiddenError.prototype);
  }
}

export class ConflictError extends AppError {
  constructor(
    message: string,
    context?: Record<string, unknown>,
  ) {
    super(message, 'CONFLICT', 409, context);
    this.name = 'ConflictError';
    Object.setPrototypeOf(this, ConflictError.prototype);
  }
}

export class InternalServerError extends AppError {
  constructor(
    message = 'Internal server error',
    context?: Record<string, unknown>,
  ) {
    super(message, 'INTERNAL_SERVER_ERROR', 500, context);
    this.name = 'InternalServerError';
    Object.setPrototypeOf(this, InternalServerError.prototype);
  }
}

export class BlockchainError extends AppError {
  constructor(
    message: string,
    context?: Record<string, unknown>,
  ) {
    super(message, 'BLOCKCHAIN_ERROR', 500, context);
    this.name = 'BlockchainError';
    Object.setPrototypeOf(this, BlockchainError.prototype);
  }
}

export class DatabaseError extends AppError {
  constructor(
    message: string,
    context?: Record<string, unknown>,
  ) {
    super(message, 'DATABASE_ERROR', 500, context);
    this.name = 'DatabaseError';
    Object.setPrototypeOf(this, DatabaseError.prototype);
  }
}
