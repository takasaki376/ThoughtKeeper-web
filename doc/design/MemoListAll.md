# MemoListAll 設計書

## 1. 概要
- 目的: 保存済みメモの一覧を、日付およびテーマで絞り込んで閲覧できるページを提供する。
- 対象ファイル: `src/app/(authenticated)/MemoListAll/page.tsx`, `src/app/(authenticated)/MemoListAll/DatePicker.tsx`
- ルート: Next.js App Router の `(authenticated)` グループ配下の `MemoListAll` ページ。

## 2. UI 構成
- ヘッダー
  - タイトル: 「保存されたメモ」
  - 件数: 表示件数/全件数（例: `3/10`）
- フィルタ
  - 日付フィルタ: `DatePickerComponent`（メモが存在する日付のみ選択可能、クリア可）
  - テーマセレクト: 一意なテーマ一覧から選択（`全て表示` で解除）。
- メモ一覧
  - スクロール可能領域（最大高さ 60vh、モバイル向けタッチ設定）
  - 新しい順に表示（内部で配列を `reverse()`）
  - 各メモの表示項目
    - 作成日時（ローカルタイムゾーン）
    - タイトル と テーマ名
    - コンテンツ
      - `content` が `data:image` で始まる場合: 画像として表示（`next/image`）
      - それ以外: テキストとして表示（HTML から段落テキストを抽出し結合）
- ローディング/エラー/空状態
  - 読込中: `Loader` を表示
  - エラー: メッセージを表示
  - データなし: 「メモがありません」を表示

## 3. データ/状態管理
- 取得
  - `useMemos()` から `{ memos, isLoading, error }` を取得。
  - `Memo` 型を利用（`title`, `content`, `created_at`, `theme.theme` 等）。
- ローカル状態
  - `selectedTheme: string` — テーマ選択値
  - `filterDate: Date | null` — 日付選択値
- 派生値（`useMemo`）
  - `filteredMemos`
    - `filterDate` が指定された場合: ローカルタイムゾーンで当日 00:00:00.000 〜 翌日 00:00:00.000 の範囲で `created_at` をフィルタ。
    - `selectedTheme` が指定された場合: `memo.theme.theme === selectedTheme` を満たすものに限定。
  - `themes`
    - `filterDate` が指定されている場合は `filteredMemos`、そうでなければ全 `memos` を元に一意なテーマ一覧を生成。
    - 表示用 `{ id: theme, theme }` 形式に整形。

## 4. フィルタリング仕様
- 日付フィルタ（親ページ側）
  - `filterDate` を日付境界に正規化した開始/終了で `created_at` を比較。
- テーマフィルタ
  - `selectedTheme` が空でない場合に一致テーマのみに絞り込み。
- フィルタの組み合わせ
  - 日付 → テーマの順で適用（`useMemo` で依存配列: `[memos, filterDate, selectedTheme]`）。

## 5. 表示フォーマット
- コンテンツ整形 `formatContent(html: string)`
  - ブラウザ環境で `DOMParser` を使用し、`<p>` 要素のテキストを抽出。
  - 空行を除去し、段落を区切り文字（例: `、`）で結合して表示。
- 日付/時刻
  - `formatDate(dateString)`
    - `YYYY/M/D HH:mm` 形式の文字列をローカルタイムゾーンで生成（`ja-JP` ロケール）。
  - `formatTime(dateString)`
    - `HH:mm` 形式でローカルタイムゾーンの時刻を生成。

## 6. DatePickerComponent の仕様（`DatePicker.tsx`）
- 依存
  - `@mantine/dates` の `DatePicker`
  - `@mantine/core` の `Button`
- Props
  - `onDateChange: (date: Date | null) => void` — 親へ選択日を通知
  - `memos: Memo[]` — メモの配列（存在日付の計算に使用）
- 内部状態
  - `filterDate: Date | null` — 選択日（ローカル）
- ロジック
  - `memoDates`: 各 `created_at` を 00:00:00.000（ローカル）に正規化した配列。
  - `excludeDate(date)`: 渡された `date` を同様に正規化し、`memoDates` に含まれない日付を選択不可にする。
  - クリアボタン: 選択を解除し、`onDateChange(null)` を送出。
- UI
  - DatePicker（選択/除外ロジック反映）
  - 選択中のみ「クリア」ボタン表示（小サイズ、subtle 変種）

## 7. エラーハンドリング/状態遷移
- `isLoading` が真の場合はローダー表示。
- `error` が存在する場合はメッセージを表示。
- `memos` が未取得/空の場合は空状態メッセージ。

## 8. 依存関係
- ライブラリ: `react`, `next/image`, `@mantine/dates`, `@mantine/core`
- 自作コンポーネント/フック: `Loader`, `useMemos`
- 型: `@/types/database` の `Memo`

## 9. パフォーマンス/UX
- フィルタリングとテーマ一覧の算出に `useMemo` を使用して不要な再計算を抑制。
- スクロール領域に `touchAction`/`WebkitOverflowScrolling` を設定し、モバイルでの操作性を向上。
- 画像は `next/image` を使用して最適化表示。

## 10. 受け入れ条件（例）
- 日付ピッカーで選択可能なのは「メモが存在する日付」のみである。
- 日付選択またはクリア時にリストが即時に反映される。
- テーマ選択で該当メモのみ表示され、件数表示も更新される。
- 画像メモは画像として、テキストメモは整形済みテキストとして表示される。
- 読込中はローダー、エラー時はエラーメッセージ、データなし時は空状態が表示される。

