# ThoughtKeeper-web

ThoughtKeeper-webは、日々の思考やアイデアを記録・管理するためのWebアプリケーションです。

## 🚀 Getting Started

## 🧭 OpenSpec の手順

仕様をコードと並行管理し、変更の提案・検証・統合・アーカイブを行うために OpenSpec を利用します。詳細は `openspec/AGENTS.md`:1 とルートの `AGENTS.md`:1 を参照してください。

- 目的
  - 仕様駆動での開発、回帰の防止、合意形成の明確化

- 基本コマンド
  - `openspec list`                     — 進行中の変更一覧
  - `openspec list --specs`            — 仕様一覧
  - `openspec show [item]`             — 変更/仕様の詳細表示
  - `openspec validate [item] --strict` — 厳格検証（`[item]` 省略で対話/一括）

- 変更作成フロー（提案）
  1) 変更ID（kebab-case, 先頭は動詞: `add-`, `update-`, など）を決める
  2) ディレクトリを作成: `openspec/changes/<change-id>/`
  3) 必須ファイルを用意:
     - `proposal.md`（目的・変更点・影響・受け入れ基準）
     - `tasks.md`（実装手順のチェックリスト）
     - `specs/<capability>/spec.md`（仕様差分: 下記フォーマット）
  4) 仕様差分の書式:
     - 見出し: `## ADDED|MODIFIED|REMOVED Requirements`
     - 各要件に最低1つの `#### Scenario:` を含める
  5) 検証: `openspec validate <change-id> --strict`
     - OK とみなす結果:
       - 出力に「Change '<change-id>' is valid」が表示され、終了コード 0
       - 失敗時はエラー詳細が表示され、終了コード ≠ 0
     - 参考: 仕様全体の検証は `openspec validate --specs --strict`（Totals: X passed, 0 failed で合格）

- 仕様統合とアーカイブ
  - 現行仕様へ反映: `openspec/specs/<capability>/spec.md` に集約（レビュー後）
  - アーカイブ: `openspec archive <change-id> --skip-specs --yes`

- トラブルシューティング
  - Unknown item が出る: `proposal.md`/`tasks.md` が未作成、`<change-id>` が不一致、または変更が `openspec/changes/archive/*` に移動済みの可能性
  - 文字化け: ファイルを UTF-8 (LF) で保存

- 参考
  - `openspec/AGENTS.md`:1 — ワークフロー、コマンド、サンプル
  - `AGENTS.md`:1 — 本リポジトリの運用ガイド

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

#### macOS/Linux
```bash
# ポリシーの適用
./supabase/scripts/apply-policies.sh

# ポリシーの確認
./supabase/scripts/check-policies.sh
```

#### Windows
```powershell
# PowerShellを使用する場合
.\supabase\scripts\apply-policies.ps1
.\supabase\scripts\check-policies.ps1

# または、バッチファイルを使用する場合
.\supabase\scripts\apply-policies.bat
```

#### 共通コマンド
```bash
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
