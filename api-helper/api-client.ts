import { APIRequestContext, APIResponse, request } from '@playwright/test';

export interface ApiResult {
  status: number;
  body: unknown;
}

export class ApiClient {
  private authorizationToken?: string;
  private requestContext?: APIRequestContext;

  constructor(private readonly baseUrl: string) {}

  setAuthorizationToken(token: string): void {
    this.authorizationToken = token;
  }

  async get(path: string): Promise<ApiResult> {
    const context = await this.getRequestContext();
    const response = await context.get(`${this.baseUrl}${path}`, {
      headers: this.authorizationHeader(),
    });
    return this.toApiResult(response);
  }

  async post(path: string, body: unknown): Promise<ApiResult> {
    const context = await this.getRequestContext();
    const response = await context.post(`${this.baseUrl}${path}`, {
      data: body,
      headers: this.authorizationHeader(),
    });
    return this.toApiResult(response);
  }

  async close(): Promise<void> {
    await this.requestContext?.dispose();
    this.requestContext = undefined;
  }

  private async getRequestContext(): Promise<APIRequestContext> {
    this.requestContext ??= await request.newContext();
    return this.requestContext;
  }

  private async toApiResult(response: APIResponse): Promise<ApiResult> {
    const text = await response.text();
    return {
      status: response.status(),
      body: text ? JSON.parse(text) : undefined,
    };
  }

  private authorizationHeader(): Record<string, string> {
    if (!this.authorizationToken) {
      return {};
    }
    return { Authorization: `Bearer ${this.authorizationToken}` };
  }
}
