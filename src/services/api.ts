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
    // レスポンスボディが存在し、かつJSON形式の場合のみパースする
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      const data: T = await response.json();
      return { data, status: response.status };
    }
    // JSONでない場合やボディが空の場合は、nullをデータとして返す (呼び出し側で型を適切に指定する必要がある)
    return { data: null as T, status: response.status };
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

export function createDelete<T>(url: string, id: string) {
  // kyのsearchParamsオプションを使用してクエリパラメータを安全に構築
  return request<T>(url, { method: "delete", searchParams: { id } });
}
