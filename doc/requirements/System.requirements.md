# ThoughtKeeper-web システム要件

## 目的

- 本アプリは思考力を鍛える Web アプリケーションである。
- 1 日に提示するテーマをランダムに選び、各テーマに対して制限時間内にメモを入力・保存する体験を提供する。
- テーマ件数と 1 件あたりの入力時間はユーザー設定で変更可能とする。

## 対象範囲

- 実装済みの Next.js アプリ、Supabase（認証/DB/RLS）、テーマ選択、メモ編集（テキスト/手書き）、タイマー、自動保存、メモ一覧（要約/全件/絞り込み）、ユーザー設定を対象とする。

## ユーザーフロー

- 認証
  - 未ログイン時はログイン/サインアップ画面から認証する。
- テーマ選択
  - 設定の件数に基づいて、テーマをランダムに抽出して一覧表示し、開始する。
- メモ入力
  - テーマごとにタイマーが進み、テキストまたは手書きで入力する。
  - 制限時間に達すると自動保存し次のテーマへ遷移。最終テーマ後は一覧へ遷移する。
- 一覧確認
  - 当日の最新メモ要約（テーマごと）を確認する。
  - 全メモ一覧では日付/テーマで絞り込み閲覧できる。
- 設定
  - テーマ件数、入力時間、最終選択した入力形式（テキスト/手書き）を保持する。

## 機能要件

1. テーマ取得とランダム選択

- API `/api/themes` からテーマ一覧を取得する。
- 設定 `theme_count` 件だけ、重複なしでランダム抽出し、グローバル状態に保持する。

2. メモ作成（テキスト/手書き）

- タブで入力形式を切り替え可能（テキスト: Tiptap、手書き: Canvas）。
- 最後に選択した入力形式を設定として保存し、次回初期表示に反映する。
- 手書きは Data URL（`data:image/*`）として保存する。

3. タイマーと自動保存

- 各テーマに対して `time_limit` 秒のカウントダウンを行う。
- 0 秒到達時に IME 未確定文字を確定（フォーカス blur）してから保存処理を単発で実行する（多重起動防止あり）。
- 次のテーマが残っている場合はテーマを進めタイマーを再開、最終テーマ後はメモ一覧へ遷移する。

4. 設定（ユーザー毎に保持）

- `theme_count`（最小 1、最大 100、整数）
- `time_limit`（最小 1、最大 3600、秒、整数）
- `last_selected_input_type`（`text` または `drawing`）
- 取得/更新は `/api/settings` を用い、未設定時は初期レコードを作成する。

5. メモ一覧（要約）

- 当日のテーマ順の最新メモ（テキストはタグ除去プレビュー、手書きは画像）をテーマ数分だけ表示する。
- 入力が無いテーマはプレースホルダーを表示する。

6. メモ全一覧（絞り込み）

- すべての保存済みメモを時系列で表示する。
- フィルタ: 日付（ローカルタイムゾーンで当日範囲）、テーマ（ユニーク一覧から選択）。

7. 認証

- Supabase Auth によるメール/パスワード認証（ログイン/サインアップ/パスワードリセット）。

## 非機能要件

- セキュリティ
  - Supabase RLS を有効化し、ユーザーの自身のデータのみアクセス可能。
  - API はサーバー側で Supabase セッションを用いて認可する。
- パフォーマンス/UX
  - 設定/メモの取得は SWR でキャッシュし、楽観的更新を行う。
  - タイマーは 1 秒間隔の更新で十分な精度とする。
- 可用性/エラーハンドリング
  - API エラー時はユーザーに簡易メッセージを表示し、コンソールに詳細を出力する。
- 表示/時刻
  - 一覧表示の時刻はローカルタイムゾーンでフォーマットする。

## データモデル（概略）

- Theme: `{ id: string, title: string, theme: string }`
- Memo: `{ id, title?, content, created_at(UTC), theme: Theme }`
- Setting: `{ theme_count: number, time_limit: string, last_selected_input_type?: 'text'|'drawing' }`

## API 仕様（概略）

- GET `/api/themes`: 全テーマ取得
- GET `/api/settings`: 認証済ユーザーの設定を取得（未存在なら初期作成）
- PUT `/api/settings`: 部分更新（`theme_count`, `time_limit`, `last_selected_input_type`）
- GET `/api/memos`: 認証済ユーザーのメモ一覧（テーマ結合）
- PUT `/api/memos`: メモ Upsert（`{ content, theme_id, title? }`）
- 認証: `/auth/login`, `/auth/reset-password` など（App Router）

## 受け入れ基準（抜粋）

- 設定した件数 N に対し N 件のテーマが重複なくランダムに選ばれる。
- タイマー 0 秒で IME 未確定文字が確定し、メモが 1 回だけ保存される。
- 最終テーマの保存後にメモ一覧へ遷移する。
- タブ切替で入力形式が即時反映され、次回訪問時に復元される。
- メモ一覧では手書きは画像、テキストはテキストプレビューとして表示される。
- 全一覧で日付/テーマフィルタが機能し、件数表示が更新される。

## 実装トレーサビリティ（主要ファイル）

- テーマ選択: `src/app/(authenticated)/ThemeSelect/page.tsx:1`
- テーマ取得/ランダム選択: `src/hooks/useGetThemes.tsx:1`
- メモ編集（テキスト/手書き・タイマー）: `src/app/(authenticated)/MemoEditor/page.tsx:1`, `src/hooks/useThemeTimer.ts:1`
- 設定フック/サービス/画面: `src/hooks/useSettings.ts:1`, `src/services/settingsService.ts:1`, `src/app/(authenticated)/setting/page.tsx:1`
- メモ保存/取得: `src/hooks/useMemos.ts:1`, `src/app/api/memos/route.ts:1`
- 設定 API: `src/app/api/settings/route.ts:1`
- テーマ API: `src/app/api/themes/route.ts:1`
- 要約一覧: `src/app/(authenticated)/MemoList/page.tsx:1`
- 全件一覧+日付ピッカー: `src/app/(authenticated)/MemoListAll/page.tsx:1`, `src/app/(authenticated)/MemoListAll/DatePicker.tsx:1`
- 認証 UI/フロー: `src/app/(auth)/auth/login/page.tsx:1`, `src/app/(auth)/auth/reset-password/page.tsx:1`

## 前提/制約

- Supabase プロジェクトに対し、`themes`, `memos`, `user_settings` などのテーブルと RLS ポリシーが適用済みであること。
- `time_limit` は文字列型で保存されるため、利用側で数値に変換する。
- PWA/オフラインは現状の要件外（`public/manifest.json` 等は存在するが、機能要件には含めない）。

## 将来拡張（任意）

- 日次テーマの履歴保存（当日固定のテーマセット化）
- メモの編集/削除履歴、エクスポート
- テーマ管理 UI（検索/お気に入り/除外）
- 通知/リマインダー
