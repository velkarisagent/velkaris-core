import { CreateAgentUseCase } from '@application/use-cases/agent';
import { CreateListingUseCase } from '@application/use-cases/listing';
import { PurchaseListingUseCase } from '@application/use-cases/order';
import { SubmitReviewUseCase } from '@application/use-cases/review';
import { GetSellerDashboardUseCase } from '@application/use-cases/seller';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface HttpRouteHandler {
  method: string;
  path: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handler: (...args: any[]) => Promise<any>;
}

export const routes: HttpRouteHandler[] = [
  {
    method: 'POST',
    path: '/agents',
    handler: async (createAgentUseCase: CreateAgentUseCase, input: unknown) => {
      return createAgentUseCase.execute(input as never);
    },
  },
  {
    method: 'POST',
    path: '/listings',
    handler: async (createListingUseCase: CreateListingUseCase, input: unknown) => {
      return createListingUseCase.execute(input as never);
    },
  },
  {
    method: 'POST',
    path: '/orders',
    handler: async (
      purchaseListingUseCase: PurchaseListingUseCase,
      input: unknown,
    ) => {
      return purchaseListingUseCase.execute(input as never);
    },
  },
  {
    method: 'POST',
    path: '/reviews',
    handler: async (submitReviewUseCase: SubmitReviewUseCase, input: unknown) => {
      return submitReviewUseCase.execute(input as never);
    },
  },
  {
    method: 'GET',
    path: '/sellers/:sellerId/dashboard',
    handler: async (
      getSellerDashboardUseCase: GetSellerDashboardUseCase,
      sellerId: string,
    ) => {
      return getSellerDashboardUseCase.execute(sellerId);
    },
  },
];

export type HttpResponse<T> = {
  statusCode: number;
  body: T;
  headers?: Record<string, string>;
};

export function successResponse<T>(data: T, statusCode = 200): HttpResponse<T> {
  return {
    statusCode,
    body: data,
    // eslint-disable-next-line @typescript-eslint/naming-convention
    headers: { 'Content-Type': 'application/json' },
  };
}

export function errorResponse(
  message: string,
  statusCode = 500,
): HttpResponse<{ error: string }> {
  return {
    statusCode,
    body: { error: message },
    // eslint-disable-next-line @typescript-eslint/naming-convention
    headers: { 'Content-Type': 'application/json' },
  };
}
