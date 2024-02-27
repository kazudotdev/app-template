import type {
  ApiResponse,
  ApiErrorResponse,
  ApiMethod,
  ApiRequestParams,
  ApiSuccessResponse,
} from "./type";

const fetcher = async <T>(
  url: string | URL,
  request?: RequestInit,
): Promise<ApiResponse<T>> => {
  return fetch(url, request)
    .catch((e) => {
      throw new Error(e);
    })
    .then(async (r) => {
      if (!r.ok) {
        const err: ApiErrorResponse = {
          ok: false,
          body: {
            code: r.status,
            message: r.statusText,
          },
        };
        return err;
      }
      const ok: ApiSuccessResponse<T> = {
        ok: true,
        body: (await r.json()) as T,
        token: r.headers.get("X-Auth-Token") || undefined,
      };
      return ok;
    });
};

class Http {
  _http<T>(
    method: ApiMethod,
    url: string,
    { token, body }: ApiRequestParams,
  ): Promise<ApiResponse<T>> {
    const headers = new Headers();
    headers.set("Content-Type", "application/json");
    token && headers.set("Authorization", `Bearer ${token}`);
    return fetcher<T>(url, {
      method,
      headers,
      body: JSON.stringify(body),
    });
  }
  async post<T>(url: string, { token, body }: ApiRequestParams) {
    return this._http<T>("POST", url, { token, body });
  }
  async delete<T>(url: string, { token, body }: ApiRequestParams) {
    return this._http<T>("DELETE", url, { token, body });
  }
}

const http = new Http()

export { http };
