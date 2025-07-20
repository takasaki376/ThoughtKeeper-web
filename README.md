# ThoughtKeeper-web

ThoughtKeeper-webは、日々の思考やアイデアを記録・管理するためのWebアプリケーションです。

## 🚀 Getting Started

### 前提条件
- Node.js 18以上
- Yarn または npm
- Supabase CLI

### セットアップ

1. 依存関係のインストール:
```bash
yarn install
# または
npm install
```

2. Supabaseのセットアップ:
```bash
# Supabaseプロジェクトの初期化
supabase init

# ローカル開発環境の起動
supabase start

# セキュリティポリシーの適用
./supabase/scripts/apply-policies.sh
```

3. 開発サーバーの起動:
```bash
yarn dev
# または
npm run dev
```

4. ブラウザで [http://localhost:3000](http://localhost:3000) を開いてアプリケーションを確認

## 🔒 セキュリティ設定

このプロジェクトでは、Supabaseのセキュリティ対策を実装しています：

- **Row Level Security (RLS)**: 全てのテーブルで有効化
- **認証ユーザーのみアクセス**: テーブルアクセス権限を制限
- **SQLベースのポリシー管理**: GUIに依存しない管理方式

詳細は [supabase/SECURITY.md](supabase/SECURITY.md) を参照してください。

### セキュリティポリシーの管理

```bash
# ポリシーの適用
./supabase/scripts/apply-policies.sh

# ポリシーの確認
./supabase/scripts/check-policies.sh

# 本番環境へのデプロイ
supabase db push
```

## 📁 プロジェクト構造

```
src/
├── app/                    # Next.js App Router
├── component/              # 再利用可能なコンポーネント
├── hooks/                  # カスタムフック
├── services/               # APIサービス
├── store/                  # 状態管理
├── types/                  # TypeScript型定義
└── utils/                  # ユーティリティ関数

supabase/
├── migrations/             # データベースマイグレーション
├── scripts/                # セキュリティスクリプト
├── policies.sql           # セキュリティポリシー
└── SECURITY.md            # セキュリティドキュメント
```

## 🛠️ 開発

### データベースの変更
```bash
# 新しいマイグレーションの作成
supabase migration new migration_name

# マイグレーションの適用
supabase db reset --linked
```

### セキュリティポリシーの変更
1. `supabase/policies.sql` を編集
2. `./supabase/scripts/apply-policies.sh` を実行
3. アプリケーションの動作確認

## 📚 技術スタック

- **フロントエンド**: Next.js 14, TypeScript, Tailwind CSS
- **バックエンド**: Supabase (PostgreSQL, Auth, Edge Functions)
- **状態管理**: Zustand
- **認証**: Supabase Auth

## 🚀 デプロイ

### Vercel
最も簡単なデプロイ方法は [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) を使用することです。

詳細は [Next.js deployment documentation](https://nextjs.org/docs/deployment) を参照してください。

## 📞 サポート

プロジェクトに関する質問や問題がある場合は、GitHubのIssuesでお知らせください。
