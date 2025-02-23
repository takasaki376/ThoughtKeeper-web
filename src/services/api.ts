import ky from 'ky';

const api = ky.create({
  prefixUrl: '/api/', // 相対URLを使用
  retry: {
    limit: 3, // 最大リトライ回数
    methods: ['get', 'post'], // リトライするHTTPメソッド
    statusCodes: [408, 500, 502, 503, 504], // リトライするステータスコード
  },
  timeout: 5000, // タイムアウトを5秒に設定
});

export default api;
