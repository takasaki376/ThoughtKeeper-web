# MemoEditorPage 仕様書

## 1. 概要

`MemoEditorPage`は、ユーザーがテーマに沿ってメモを作成するための中心的なページです。設定された制限時間内にテキストまたは手書きで内容を入力し、時間が来ると自動的に保存され、次のテーマへと遷移します。

---

## 2. UI設計

### 構成要素

- **テーマ表示エリア**
  - **現在のテーマ**: `theme.title` と `theme.theme` を表示します。
  - **進捗**: 全テーマ数に対する現在のテーマ番号（例: `残り 3/10 個`）を表示します。
  - **残り時間**: `useThemeTimer`フックによって管理される残り時間を秒単位で表示します。

- **入力形式タブ (`Tab` コンポーネント)**
  - 「タイプ入力」と「手書き」の2つのタブを切り替えます。
  - 現在選択中のタブ状態は `activeTab` ステートで管理されます。
  - タブを切り替えると、`updateSettings` が呼び出され、ユーザーの選択 (`last_selected_input_type`) がデータベースに保存されます。これにより、次回ページを開いた際に前回の選択が復元されます。

- **入力エリア**
  - **テキスト入力 (`Tiptap` コンポーネント)**
    - リッチテキストエディタを提供します。
    - `editorRef` を使用して、タブ切り替え時にエディタへ自動的にフォーカスします。
    - 入力内容は `textContent` ステートで管理されます。
  - **手書き入力 (`Drawing` コンポーネント)**
    - Canvasを利用した描画エリアを提供します。
    - 入力内容は `drawingContent` ステート（Base64形式のデータURL）で管理されます。
    - `hasDrawingInput` フラグが `true` の場合、タイマー終了後のテーマ切り替え時に自動で「手書き」タブが選択されます。

---

## 3. 主要ロジック・状態管理

- **テーマ管理**
  - `themes` (Jotai Atom): Supabaseから取得した全テーマのリスト。
  - `currentThemeIndex`: 現在表示しているテーマのインデックス番号。
  - `handleThemeChange`: 次のテーマへ遷移する関数。入力内容（`textContent`, `drawingContent`）をリセットし、`currentThemeIndex` を更新します。

- **メモ保存ロジック (`useMemos` フック)**
  - `saveTextMemo`, `saveDrawingMemo`: それぞれの入力内容を `updateMemo` を介してAPIに送信し、メモを保存します。
  - 保存が成功すると、グローバル状態 `recentMemosAtom` が更新され、UIに即時反映されます。

- **タイマーロジック (`useThemeTimer` カスタムフック)**
  - このフックは、テーマごとのカウントダウンタイマーの全ロジックをカプセル化します。
  - **初期化**: ユーザー設定の制限時間 (`initialTime`)、テーマ総数 (`themeCount`)、現在のテーマインデックス (`currentIndex`)、保存用コールバック (`onSave`)、テーマ変更用コールバック (`onThemeChange`) を引数に取ります。
  - **タイマー開始**: `useEffect`内で `startTimer` が呼び出され、`setInterval` により1秒ごとに `remainingTime` ステートが更新されます。
  - **時間切れ処理 (`remainingTime <= 1` の場合):**
    1. **多重実行防止**: `isSavingRef` フラグを `true` に設定し、保存処理の重複を防ぎます。
    2. **タイマー停止**: `clearInterval` で現在のタイマーを即座に停止します。
    3. **IME変換の確定**:
       - `document.activeElement` で現在フォーカス中の要素（入力フィールド）を取得します。
       - `activeElement.blur()` を実行し、入力フィールドからフォーカスを外すことで、**変換中の日本語（IME）を強制的に確定させます**。これにより、変換途中のテキストが保存されるのを防ぎます。
       - `setTimeout` で100ms待機し、blur処理と状態更新が完了するのを待ちます。
    4. **保存と遷移の実行**:
       - `onSave` コールバック（`saveTextMemo` と `saveDrawingMemo` を実行）を呼び出します。
       - **次のテーマがある場合**:
         - `onThemeChange` を呼び出して次のテーマに切り替えます。
         - `remainingTime` を初期値に戻し、`startTimer()` を再帰的に呼び出して新しいタイマーを開始します。
       - **最後のテーマの場合**:
         - `router.push("/MemoList")` を実行し、メモ一覧ページへ遷移します。
    5. **エラーハンドリング**: 保存処理中にエラーが発生した場合、コンソールにエラーを出力し、現在のテーマでタイマーを再開します。
    6. **フラグ解除**: `finally` ブロックで `isSavingRef` を `false` に戻します。

---

## 4. API連携

- **設定の取得・保存 (`useSettings` フック)**
  - `GET /api/settings`: ページ読み込み時にユーザー設定（`time_limit`, `last_selected_input_type`など）を取得します。
  - `PUT /api/settings`: タブ切り替え時に `last_selected_input_type` を更新します。

- **メモの保存 (`useMemos` フック)**
  - `PUT /api/memos`: テキストまたは描画メモを保存します。リクエストボディには `{ content, theme_id }` または `{ title, content, theme_id }` が含まれます。

---

## 5. 依存関係

- **ライブラリ**: `jotai`, `react`, `next/navigation`
- **カスタムフック**: `useSettings`, `useMemos`, `useThemeTimer`
- **コンポーネント**: `Tab`, `Tiptap`, `Drawing`, `Loader`
- **グローバル状態 (Jotai Atoms)**: `themeAtom`, `recentMemosAtom`