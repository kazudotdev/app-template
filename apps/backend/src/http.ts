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
        console.error("Error in fetcher: " + r.statusText);
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
    { body, headers }: ApiRequestParams,
  ): Promise<ApiResponse<T>> {
    const h = ((h?: Headers) => {
      const header = h || new Headers();
      header.set("Content-Type", "application/json");
      return header;
    })(headers);

    return fetcher<T>(url, {
      method,
      headers: h,
      body: JSON.stringify(body),
    });
  }
  async post<T>(url: string, request: ApiRequestParams) {
    return this._http<T>("POST", url, request);
  }
  async delete<T>(url: string, request: ApiRequestParams) {
    return this._http<T>("DELETE", url, request);
  }
}

const http = new Http();

export { http };
