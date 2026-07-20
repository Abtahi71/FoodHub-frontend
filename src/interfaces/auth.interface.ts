export interface LoginParams {
  searchParams: { redirect?: string };
}
export interface APIRequestOptions {
  params?: Record<string, unknown>;
  headers?: Record<string, string>;
}
export interface LoginFormProps {
  redirectPath?: string;
}

export interface SignupFormProps {
  redirectPath?: string;
}
