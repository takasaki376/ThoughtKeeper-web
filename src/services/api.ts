import ky, { type HTTPError, type Options } from "ky";

// クライアントサイド用のAPIインスタンス
export const api = ky.create({
  headers: {
    "Content-Type": "application/json",
  },

  prefixUrl: "/api/",
  retry: {
    limit: 3,
    methods: ["get", "post", "put", "patch", "delete"],
    statusCodes: [408, 500, 502, 503, 504],
  },
  timeout: 5000,
});

/**
 * 汎用的なAPIリクエスト関数
 * @param url リクエスト先のパス
 * @param options kyのオプション
 * @returns {Promise<{ data: T, status: number }>} APIからのレスポンスデータとステータスコード
 */
async function request<T>(
  url: string,
  options: Options = {}
): Promise<{ data: T; status: number }> {
  try {
    const response = await api(url, options);
    const responseData: T = await response.json();
    return { data: responseData, status: response.status };
  } catch (error: unknown) {
    const httpError = error as HTTPError;
    console.error(`❌ API request failed: ${httpError.message}`, {
      request: httpError.request,
      response: httpError.response,
    });
    throw error;
  }
}

export function createGet<T>(url: string) {
  return request<T>(url, { method: "get" });
}

export function createPost<T, D = unknown>(url: string, postData: D) {
  return request<T>(url, { json: postData, method: "post" });
}

export function createPut<T, D = unknown>(url: string, postData: D) {
  return request<T>(url, { json: postData, method: "put" });
}

export function createPatch<T, D = unknown>(url: string, updateData: D) {
  return request<T>(url, { json: updateData, method: "patch" });
}

export async function createDelete(
  url: string,
  id: string
): Promise<{ data: { id: string }; status: number }> {
  try {
    const response = await api.delete(`${url}?id=${id}`);
    // DELETEリクエストは空のレスポンスを返すことが多いため、成功した場合はIDを返すようにする
    return { data: { id }, status: response.status };
  } catch (error: unknown) {
    const httpError = error as HTTPError;
    console.error(`❌ API delete failed: ${httpError.message}`, {
      request: httpError.request,
      response: httpError.response,
    });
    throw error;
  }
}
