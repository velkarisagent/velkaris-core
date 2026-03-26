import { AppError } from '@shared/errors';
import { logger } from '@shared/logger';

export class ControllerBase {
  protected handleError(error: unknown): { statusCode: number; message: string } {
    if (error instanceof AppError) {
      logger.warn('Application error', {
        code: error.code,
        statusCode: error.statusCode,
        message: error.message,
      });

      return {
        statusCode: error.statusCode,
        message: error.message,
      };
    }

    logger.error('Unexpected error', {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });

    return {
      statusCode: 500,
      message: 'Internal server error',
    };
  }
}

export class AgentController extends ControllerBase {
  // TODO: Implement agent endpoints
}

export class ListingController extends ControllerBase {
  // TODO: Implement listing endpoints
}

export class OrderController extends ControllerBase {
  // TODO: Implement order endpoints
}

export class ReviewController extends ControllerBase {
  // TODO: Implement review endpoints
}

export class SellerController extends ControllerBase {
  // TODO: Implement seller endpoints
}
