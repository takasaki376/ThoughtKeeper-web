import ky from 'ky';

import { create_ServerClient } from '@/utils/supabase/server';

const idToken = async () => {
  const supabase = create_ServerClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    throw new Error('ユーザーが認証されていません');
  }

  return { token: session.access_token };
};

function createApiInstance() {
  return ky.create({
    headers: {
      'Content-Type': 'application/json',
    },
    hooks: {
      beforeRequest: [
        async (request) => {
          console.log(`📡 Sending request to: ${request.url}`);
          const token = (await idToken()).token; // トークンを取得する関数

          request.headers.set('Authorization', `Bearer ${token}`);
        },
      ],
    },
    prefixUrl: '/api/', // 相対URLを使用
    retry: {
      limit: 3, // 最大リトライ回数
      methods: ['get', 'post', 'put', 'patch', 'delete'], // リトライするHTTPメソッド
      statusCodes: [408, 500, 502, 503, 504], // リトライするステータスコード
    },
    timeout: 5000, // タイムアウトを5秒に設定
  });
}
export const api = createApiInstance();
