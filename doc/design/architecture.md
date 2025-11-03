# ThoughtKeeper-web 設計書

// filepath: doc/architecture.md

## 概要

ThoughtKeeper-web は、日々の思考やアイデアを記録・管理するための Web アプリケーションです。  
テキスト・手書き・テーマごとのメモ管理、ユーザー認証、セキュリティポリシー（Supabase RLS）を備えています。

---

## 技術スタック

- Next.js (App Router)
- TypeScript
- Supabase (DB, Auth, Storage)
- Jotai (状態管理)
- Tiptap (リッチテキストエディタ)
- ky (API 通信)
- PowerShell/Bash (セキュリティスクリプト)

---

## 機能一覧

- ユーザー認証（サインアップ・ログイン・パスワードリセット）
- メモの作成・編集・削除（テキスト・手書き）
- テーマごとのメモ管理
- メモ一覧・絞り込み・日付/テーマ検索
- セキュリティ（RLS, ポリシー管理）
- ファイルアップロード（画像）

---

## ディレクトリ構成

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/auth/        # 認証関連ページ
│   ├── (authenticated)/    # 認証後のページ
├── component/              # 再利用可能なコンポーネント
├── hooks/                  # カスタムフック
├── services/               # APIサービス
├── store/                  # 状態管理
├── types/                  # TypeScript型定義
└── utils/                  # ユーティリティ関数

supabase/
├── migrations/             # DBマイグレーション
├── scripts/                # セキュリティスクリプト
├── policies.sql            # セキュリティポリシー
└── SECURITY.md             # セキュリティドキュメント

doc/
└── architecture.md         # 設計書（本ファイル）
```

---

## 認証・セキュリティ設計

- Supabase Auth によるユーザー認証
- Row Level Security（RLS）を全テーブルで有効化
- SQL ベースのポリシー管理（`supabase/policies.sql`）
- セキュリティスクリプトでポリシー適用・確認（Windows/Unix 両対応）

---

## メモ管理設計

- テーマごとにメモを作成・保存
- テキスト入力は Tiptap エディタ、手書き入力は Canvas で実装
- メモ保存時は API 経由で Supabase に PUT リクエスト
- メモ一覧は日付・テーマで絞り込み可能

---

## API 設計

- `/api/memos` … メモの取得・保存
- `/api/settings` … ユーザー設定の取得・更新
- `/api/auth/reset-password` … パスワードリセットメール送信
- `/api/auth/reset-password/confirm` … パスワード更新

---

## UI 設計

- テーマ選択・残り時間表示
- タブ切り替え（テキスト/手書き）
- メモ一覧・詳細表示
- 日付・テーマでの絞り込み
- レスポンシブ対応（PC/タブレット/スマホ）

---

## セキュリティポリシー管理

- `supabase/scripts/apply-policies.sh` / `.ps1` … ポリシー適用
- `supabase/scripts/check-policies.sh` / `.ps1` … ポリシー確認
- 詳細は [`supabase/SECURITY.md`](../supabase/SECURITY.md) を参照

---

## 補足

- 詳細な実装・API 仕様は各ディレクトリの README やコードコメントを参照してください。
- セキュリティ・運用に関する問い
