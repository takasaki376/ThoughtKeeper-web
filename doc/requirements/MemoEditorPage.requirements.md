# MemoEditorPage 要件

## 1. 目的

- テーマに沿ったメモを、制限時間内にテキストまたは手書きで作成・保存できる編集ページを提供する。
- 制限時間到達で自動保存し、次のテーマへ遷移（最終テーマ後はメモ一覧へ遷移）する体験を実現する。

## 2. 対象

- 対象ページ: `MemoEditorPage`
- 関連フック: `useSettings`, `useMemos`, `useThemeTimer`
- 関連グローバル状態 (Jotai): `themeAtom`, `recentMemosAtom`
- 関連コンポーネント: `Tab`, `Tiptap`, `Drawing`, `Loader`

## 3. 機能要件

- テーマ表示
  - 現在のテーマのタイトル/内容を表示する（`theme.title`, `theme.theme`）。
- 進捗表示
  - 全テーマ数に対する現在のテーマ番号（例: `残り 3/10 個`）を表示する。
- 残り時間表示
  - ユーザー毎の設定値に基づいて、メモを入力する残り時間を秒単位で表示する。
  - 残り時間は設定値から、１秒ずつカウントダウンする
- 入力形式の切替（タブ）
  - 「タイプ入力」と「手書き」をタブで切替できる。
  - 起動時は前回指定していたタブを初期表示する
- テキスト入力（`Tiptap`）
  - リッチテキストエディタを提供する。
  - タブ切替時に 自動フォーカスする。
- 手書き入力（`Drawing`）
  - Canvas による描画エリアを提供する。
  - 入力内容は `drawingContent`（Base64 形式の Data URL）で管理する。
- 自動保存と遷移
  - 残り時間が０秒に達したら保存処理を実行する。
  - 保存完了後、次のテーマが存在すればテーマを切替え、タイマーを初期化して再開する。
  - 最後のテーマであれば `/MemoList` へ遷移する。
- IME 変換確定
  - 保存直前にアクティブ要素を `blur()` し、日本語 IME の未確定文字を確定させる。
  - `setTimeout(100ms)` で状態反映を待ってから保存を実行する。
- エラー時の挙動
  - 保存中にエラーが発生した場合、コンソールにエラーを出力し、現在のテーマでタイマーを再開する。
- 多重実行防止
  - 保存フローは `isSavingRef` により多重実行を防止する。

## 4. 状態/ロジック要件

- テーマ管理
  - `themes`（Supabase から取得したテーマリスト）を参照する。
  - 現在のテーマインデックスは `currentThemeIndex` で管理する。
  - `handleThemeChange` は `textContent`/`drawingContent` をリセットし、`currentThemeIndex` を更新する。
- メモ保存（`useMemos`）
  - `saveTextMemo` / `saveDrawingMemo` で入力内容を API に送信し保存する（内部で `updateMemo` を利用）。
  - 保存成功時に `recentMemosAtom` を更新し、UI に即時反映する。
- タイマー（`useThemeTimer`）
  - 初期化引数: `initialTime`（ユーザー設定の制限時間）, `themeCount`, `currentIndex`, `onSave`, `onThemeChange`。
  - 1 秒間隔で `remainingTime` を更新する。
  - 時間到達時のフロー: 多重防止 → タイマー停止 → IME 確定 → 保存 → 次テーマ遷移 or 一覧遷移 → フラグ解除。

## 5. API 要件

- 設定取得/保存（`useSettings`）
  - `GET /api/settings`: ページ読み込み時に `time_limit`, `last_selected_input_type` を取得する。
  - `PUT /api/settings`: タブ切替時に `last_selected_input_type` を更新する。
- メモ保存（`useMemos`）
  - `PUT /api/memos`: テキスト/描画メモを保存する。
  - リクエストボディ例: `{ content, theme_id }` または `{ title, content, theme_id }`。

## 6. UI/UX 要件

- 表示
  - テーマ情報、進捗、残り時間、入力エリア（テキスト/手書き）を適切にレイアウトする。
- 操作性
  - タブ切替は即時に反映され、次回訪問時も前回選択が復元される。
  - テキストタブ選択時はエディタに自動フォーカスされる。
- フィードバック
  - 保存中/処理中は分かるようにローディング表示（`Loader`）を行うことが望ましい。

## 7. 依存関係

- ライブラリ: `react`, `jotai`, `next/navigation`
- カスタムフック: `useSettings`, `useMemos`, `useThemeTimer`
- コンポーネント: `Tab`, `Tiptap`, `Drawing`, `Loader`
- グローバル状態: `themeAtom`, `recentMemosAtom`

## 8. 受け入れ条件（抜粋）

- 残り時間が 0 になったとき、未確定の IME 入力が確定され、メモが保存される。
- 次のテーマが存在する場合に自動で切替わり、タイマーがリセットされて再開する。
- 最終テーマの保存後は `/MemoList` に遷移する。
- タブ切替により `last_selected_input_type` が永続化され、再訪時に復元される。
- 保存成功時に `recentMemosAtom` が更新され、UI に直ちに反映される。
- 保存処理は多重に実行されない。

## 9. 補足/前提

- テーマデータは Supabase から取得され、Jotai Atom で参照可能である。
- API のスキーマ（`/api/settings`, `/api/memos`）は上記仕様を満たす必要がある。
- タイマーは 1 秒間隔の更新で十分な正確性を持つものとする。
