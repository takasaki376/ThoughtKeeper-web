import ky from 'ky';


// クライアントサイド用のAPIインスタンス
export const api = ky.create({
  headers: {
    'Content-Type': 'application/json',
  },
  hooks: {
    beforeRequest: [
      async (request) => {
        // クライアントサイドでセッションからトークンを取得
        const { data: { session } } = await fetch('/api/auth/session').then(res => res.json());
        if (session?.access_token) {
          request.headers.set('Authorization', `Bearer ${session.access_token}`);
        }
        return request;
      },
    ],
  },
  prefixUrl: '/api/',
  retry: {
    limit: 3,
    methods: ['get', 'post', 'put', 'patch', 'delete'],
    statusCodes: [408, 500, 502, 503, 504],
  },
  timeout: 5000,
});

export async function createGet<T>(pass: string) {
  try {
    const response = await api.get<T>(pass);
    const responseData: T = await response.json();
    return { data: responseData, status: response.status };
  } catch (error) {
    console.error('❌ Error creating get:', error);
    throw error;
  }
}

export async function createPost<T, D = unknown>(pass: string, postData: D) {
  try {
    const response = await api.post<T>(pass, {
      json: postData,
    });
    const data: T = await response.json();
    return { data: [data], status: response.status };
  } catch (error) {
    console.error('❌ Error creating post:', error);
    throw error;
  }
}

export async function createPut<T, D = unknown>(pass: string, postData: D) {
  try {
    const response = await api.put<T>(pass, {
      json: postData,
    });
    const responseData: T = await response.json();
    return { data: responseData, status: response.status };
  } catch (error) {
    console.error('❌ Error creating put:', error);
    throw error;
  }
}

export async function createPatch<T, D = unknown>(pass: string, updateData: D) {
  try {
    const response = await api.patch<T>(pass, {
      json: updateData,
    });
    const responseData: T = await response.json();
    return { data: [responseData], status: response.status };
  } catch (error) {
    console.error('❌ Error updating patch:', error);
    throw error;
  }
}

export async function createDelete<T>(pass: string, id: string) {
  try {
    const response = await api.delete(`${pass}?id=${id}`);
    return { data: id as unknown as T[], status: response.status };
  } catch (error) {
    console.error('❌ Error delete:', error);
    throw error;
  }
}
