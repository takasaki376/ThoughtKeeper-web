# MemoEditorPage 仕様書

## 1. 概要

`MemoEditorPage`は、ユーザーがテーマに沿ってメモを作成するための中心的なページです。設定された制限時間内にテキストまたは手書きで内容を入力し、時間が来ると自動的に保存され、次のテーマへと遷移します。

---

## 2. UI 設計

### 構成要素

- **テーマ表示エリア**

  - **現在のテーマ**: `theme.title` と `theme.theme` を表示します。
  - **進捗**: 全テーマ数に対する現在のテーマ番号（例: `残り 3/10 個`）を表示します。
  - **残り時間**: `useThemeTimer`フックによって管理される残り時間を秒単位で表示します。

- **入力形式タブ (`Tab` コンポーネント)**

  - 「タイプ入力」と「手書き」の 2 つのタブを切り替えます。
  - 現在選択中のタブ状態は `activeTab` ステートで管理されます。
  - タブを切り替えると、`updateSettings` が呼び出され、ユーザーの選択 (`last_selected_input_type`) がデータベースに保存されます。これにより、次回ページを開いた際に前回の選択が復元されます。

- **入力エリア**
  - **テキスト入力 (`Tiptap` コンポーネント)**
    - リッチテキストエディタを提供します。
    - `editorRef` を使用して、タブ切り替え時にエディタへ自動的にフォーカスします。
    - 入力内容は `textContent` ステートで管理されます。
  - **手書き入力 (`Drawing` コンポーネント)**
    - Canvas を利用した描画エリアを提供します。
    - 入力内容は `drawingContent` ステート（Base64 形式のデータ URL）で管理されます。
    - `hasDrawingInput` フラグが `true` の場合、タイマー終了後のテーマ切り替え時に自動で「手書き」タブが選択されます。

---

## 3. 主要ロジック・状態管理

- **テーマ管理**

  - `themes` (Jotai Atom): Supabase から取得した全テーマのリスト。
  - `currentThemeIndex`: 現在表示しているテーマのインデックス番号。
  - `handleThemeChange`: 次のテーマへ遷移する関数。入力内容（`textContent`, `drawingContent`）をリセットし、`currentThemeIndex` を更新します。

- **メモ保存ロジック (`useMemos` フック)**

  - `saveTextMemo`, `saveDrawingMemo`: それぞれの入力内容を `updateMemo` を介して API に送信し、メモを保存します。
  - 保存が成功すると、グローバル状態 `recentMemosAtom` が更新され、UI に即時反映されます。

- **タイマーロジック (`useThemeTimer` カスタムフック)**
  - このフックは、テーマごとのカウントダウンタイマーの全ロジックをカプセル化します。
  - **初期化**: ユーザー設定の制限時間 (`initialTime`)、テーマ総数 (`themeCount`)、現在のテーマインデックス (`currentIndex`)、保存用コールバック (`onSave`)、テーマ変更用コールバック (`onThemeChange`) を引数に取ります。
  - **タイマー開始**: `useEffect`内で `startTimer` が呼び出され、`setInterval` により 1 秒ごとに `remainingTime` ステートが更新されます。
  - **時間切れ処理 (`remainingTime <= 1` の場合):**
    1. **多重実行防止**: `isSavingRef` フラグを `true` に設定し、保存処理の重複を防ぎます。
    2. **タイマー停止**: `clearInterval` で現在のタイマーを即座に停止します。
    3. **IME 変換の確定**:
       - `document.activeElement` で現在フォーカス中の要素（入力フィールド）を取得します。
       - `activeElement.blur()` を実行し、入力フィールドからフォーカスを外すことで、**変換中の日本語（IME）を強制的に確定させます**。これにより、変換途中のテキストが保存されるのを防ぎます。
       - `setTimeout` で 100ms 待機し、blur 処理と状態更新が完了するのを待ちます。
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

## 4. API 連携

- **設定の取得・保存 (`useSettings` フック)**

  - `GET /api/settings`: ページ読み込み時にユーザー設定（`time_limit`, `last_selected_input_type`など）を取得します。
  - `PUT /api/settings`: タブ切り替え時に `last_selected_input_type` を更新します。

- **メモの保存 (`useMemos` フック)**
  - `PUT /api/memos`: テキストまたは描画メモを保存します。リクエストボディには `{ content, theme_id }` または `{ title, content, theme_id }` が含まれます。

---

## 3. 補足

- 画面はレスポンシブ対応（PC/タブレット/スマホ）
- 入力欄は自動フォーカス・IME 変換確定後の保存も考慮
- タブ状態・テーマ状態は DB と同期
- API 通信は`ky`ライブラリで実装

---

# <<<<<<< HEAD

```# MemoEditorPage 設計書
// filepath: doc/MemoEditorPage.md

## 1. 画面UI設計

### 構成要素

- **テーマ表示エリア**
  - 現在のテーマタイトル・内容を表示
  - 残りテーマ数・残り時間を表示

- **タブ切り替え**
  - `Tab`コンポーネントで「タイプ入力する」「手書きする」を切り替え
  - 選択中タブの状態は`activeTab`で管理
  - タブ切り替え時にDBへ`last_selected_input_type`を保存

- **入力エリア**
  - テキスト入力: `Tiptap`エディタ（リッチテキスト対応）
    - `editorRef`で自動フォーカス制御
    - 入力内容は`textContent`で管理
  - 手書き入力: `Drawing`コンポーネント（Canvas描画）
    - 入力内容は`drawingContent`で管理
    - タッチ・マウス両対応

- **テーマ切り替え**
  - `handleThemeChange`で次のテーマへ移動
  - テーマ切り替え時に入力内容をリセット
  - 手書き入力があれば自動で「手書き」タブに切り替え

- **タイマー**
  - `useThemeTimer`フックで残り時間を管理
  - タイマー終了時に自動保存＆次テーマへ遷移

---

## 2. API設計

### 設定取得・保存

- **`fetchSettings`**
  - ユーザー設定（テーマ数・制限時間・最終選択タブ）を取得
  - 初回マウント時にタブ状態復元

- **`updateSettings`**
  - タブ切り替え時に`last_selected_input_type`を保存
  - テーマ数・制限時間も同時に保存

---

### メモ保存

- **テキストメモ保存**
  - API: `PUT /api/memos`
  - リクエスト: `{ content, theme_id }`
  - レスポンス: `Memo`型
  - 保存後、同じテーマの既存メモを更新 or 新規追加
  - `recentMemosAtom`も同時更新

- **描画メモ保存**
  - API: `PUT /api/memos`
  - リクエスト: `{ title: "描画メモ", content, theme_id }`
  - レスポンス: `Memo`型
  - 保存後、同じテーマの既存メモを更新 or 新規追加
  - `recentMemosAtom`も同時更新

---

### その他

- **状態管理**
  - jotaiでテーマ・メモリスト・最近のメモを管理
  - テーマ切り替えや保存時にatomを更新

- **エラーハンドリング**
  - 保存失敗時は`console.error`でログ出力
  - タイマー終了時の保存も例外処理あり

---

## 3. 補足

- 画面はレスポンシブ対応（PC/タブレット/スマホ）
- 入力欄は自動フォーカス・IME変換確定後の保存も考慮
- タブ状態・テーマ状態はDBと同期
- API通信は`ky`ライブラリで
```

> > > > > > > 10e6b9b (MemoEditor の設計書追加)
