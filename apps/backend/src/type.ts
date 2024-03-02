type ApiResponse<T> = ApiErrorResponse | ApiSuccessResponse<T>;

type ApiMethod = "POST" | "GET" | "DELETE" | "PUT";

type ApiErrorResponse = {
  ok: false;
  body: {
    code: number;
    message: string;
  };
};
type ApiSuccessResponse<T> = {
  ok: true;
  body: T;
  token: string | undefined;
};

type ApiRequestParams = Partial<{
  headers: Headers;
  body: Record<string, unknown>;
}>;

type UserFindByEmailResult = {
  email_id: string;
  has_webauthn_credential: boolean;
  id: string;
  verified: boolean;
};

type UserCreateResult = {
  email_id: string;
  user_id: string;
};

type UserDeleteResult = {};

type PasscodeLoginResult = {
  created_at: string;
  id: string; // should be used in /passcode/login/finalize
  ttl: number;
};

export type {
  // Common
  ApiResponse,
  ApiErrorResponse,
  ApiSuccessResponse,
  ApiMethod,
  ApiRequestParams,
  // Hanko API Response
  UserFindByEmailResult,
  UserCreateResult,
  UserDeleteResult,
  PasscodeLoginResult,
};
