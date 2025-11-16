# memos Specification

## Purpose
TBD - created by archiving change add-baseline-specs-existing-features. Update Purpose after archive.
## Requirements
### Requirement: List memos for current user

- `GET /api/memos` SHALL return the caller’s memos, joined with their theme object: `theme: { id, title, theme }`.
- Unauthorized requests MUST return 401 with `{ error: 'no user' }`. Server errors MUST return 500 with `{ error, details }`.
- JA: 現在のユーザーのメモ一覧
- JA: `GET /api/memos` は呼び出しユーザーのメモを、関連するテーマ（`theme: { id, title, theme }`）を結合して返さなければならない。未認証は 401（`{ error: 'no user' }`）、サーバーエラーは 500（`{ error, details }`）を返さなければならない。

#### Scenario: Fetch memos with joined theme

- Given a valid session and memo rows for the user
- When requesting `GET /api/memos`
- Then respond 200 with an array of memos including `theme`
- JA: 有効なセッションで `GET /api/memos` を呼ぶと、`theme` を含むメモ配列が 200 で返る。

### Requirement: Upsert memo

- `PUT /api/memos` MUST accept `{ content, theme_id, title? }` and upsert a row for the user with `created_at` set server-side.
- It MUST return the upserted row with `theme` expanded. Unauthorized requests MUST return 401.
- JA: メモのアップサート
- JA: `PUT /api/memos` は `{ content, theme_id, title? }` を受け取り、`created_at` をサーバー側で設定してユーザーのメモをアップサートしなければならない。結果として `theme` を展開した行を返し、未認証は 401 を返さなければならない。

#### Scenario: Create or update memo entry

- Given a valid session
- When putting a memo payload to `/api/memos`
- Then insert or update the memo and return the row with joined `theme`
- JA: 有効なセッションで `/api/memos` にメモを PUT すると、作成または更新され、`theme` を含む行が返る。

### Requirement: Memo Editor flow with auto-save timer

- The Memo Editor SHALL support text input and drawing input, tied to the current theme from Theme Select.
- A countdown per theme (based on `time_limit`) MUST auto-save the current content and advance to the next theme until all are completed, then navigate to `/MemoList`.
- JA: 自動保存タイマー付きのメモ編集フロー
- JA: メモエディターはテーマ選択で決まる現在のテーマに対して、テキスト入力と描画入力をサポートしなければならない。各テーマのカウントダウン（`time_limit`）満了時に自動保存し、次のテーマへ進み、最後まで完了したら `/MemoList` へ遷移しなければならない。

#### Scenario: Auto-save and advance on timer expiry

- Given the editor is active for theme index `i`
- When the countdown reaches zero
- Then save current content via `/api/memos`, advance to theme index `i+1`, and after the last theme navigate to `/MemoList`
- JA: テーマ i の編集中にカウントダウンが 0 になると、`/api/memos` で保存し、テーマ i+1 へ進み、最後のテーマの後は `/MemoList` に遷移する。

### Requirement: Memo List

- The Memo List view SHALL display recent memo entries per theme (or an empty state when none), formatting text content to plain lines and rendering image content when stored as a data URL.
- JA: メモ一覧表示
- JA: メモ一覧はテーマごとの最新メモ（なければ空状態）を表示し、テキストはプレーンな行として整形し、データ URL の画像は画像として表示しなければならない。

#### Scenario: Render memo entries per theme

- Given saved memos and the theme selection
- When displaying the list
- Then show the latest memo for each relevant theme with appropriate formatting or empty-state messaging
- JA: 保存済みメモとテーマ選択がある場合、各テーマの最新メモを適切な整形で表示し、存在しない場合は空状態のメッセージを表示する。

### Requirement: Memo Editor frontend UI

- The Memo Editor page at route `/MemoEditor` SHALL display the current theme’s `title` and `theme`, progress `current/total`, and a countdown in seconds.
- It MUST provide two tabs: “text input” using a rich text editor and “drawing” using a canvas; switching tabs MUST preserve the current input values.
- The editor MUST auto-focus the text editor when the “text” tab becomes active and SHOULD be responsive across devices.
- JA: メモエディターのフロントエンド UI
- JA: ルート `/MemoEditor` にて、現在のテーマの `title` と `theme`、進捗（`現在/合計`）、秒単位のカウントダウンを表示しなければならない。
- JA: 「タイプ入力」と「手書き」の 2 タブを提供し、タブ切り替え時も入力内容を保持しなければならない。テキストタブが有効化されたときはエディタへ自動フォーカスし、画面はレスポンシブであるべきである。

#### Scenario: Switch tabs and keep inputs

- Given the user entered text and a drawing
- When switching between the “text” and “drawing” tabs
- Then both inputs remain intact and can be saved on timer expiry
- JA: テキスト・手書きの両方に入力がある状態でタブを切り替えても、どちらの入力も保持され、タイマー満了時に保存できる。

### Requirement: Persist last selected input type

- Switching tabs MUST persist `last_selected_input_type` via `PUT /api/settings` so it restores on next visit.
- On page load, the UI MUST restore the last selected tab using the value returned from `GET /api/settings`.
- JA: 最終選択した入力種別の永続化
- JA: タブ切り替え時に `PUT /api/settings` で `last_selected_input_type` を保存しなければならない。ページ読み込み時は `GET /api/settings` の値でタブ状態を復元しなければならない。

#### Scenario: Restore last tab on load

- Given `last_selected_input_type = 'drawing'` is stored for the user
- When opening `/MemoEditor`
- Then the “drawing” tab is active initially
- JA: ユーザーに `last_selected_input_type = 'drawing'` が保存されている場合、`/MemoEditor` を開くと初期状態で「手書き」タブが選択される。

### Requirement: Frontend save behavior and cache update

- On timer expiry, the UI MUST save both inputs that have content by calling `PUT /api/memos` once per input type and MUST prevent duplicate concurrent saves.
- After a successful save, the UI SHOULD optimistically update the in-memory list of recent memos for that theme so the list and viewer reflect the new entry without a full refetch.
- JA: フロントエンドの保存動作とキャッシュ更新
- JA: タイマー満了時、内容がある入力（テキスト/描画）はそれぞれ `PUT /api/memos` を呼び出して保存し、重複保存が起きないように制御しなければならない。保存成功後は該当テーマの最近メモをメモリ上で楽観的に更新し、全体再取得なしで一覧/ビューに反映するのが望ましい。

#### Scenario: Optimistic update after save

- Given a memo save succeeds for theme A
- When the response returns the upserted row
- Then the recent memos cache for theme A is updated immediately
- JA: テーマAの保存が成功しレスポンスで行が返ったら、テーマAの最近メモのキャッシュが即時に更新される。

### Requirement: IME commit and navigation on completion

- When the countdown hits zero, the UI MUST blur the active input to commit in-progress IME composition before saving. After the last theme is processed, it MUST navigate to `/MemoList`.
- JA: IME確定と完了時の遷移
- JA: カウントダウンが 0 になったら、保存前にアクティブ入力を blur して変換中の IME を確定させなければならない。最後のテーマを処理後は `/MemoList` へ遷移しなければならない。

#### Scenario: Commit IME and navigate after last theme

- Given the editor is on the final theme with active text composition
- When the timer expires
- Then the input is blurred to commit IME, the memo is saved, and the app navigates to `/MemoList`
- JA: 最後のテーマでテキスト変換中にタイマーが満了すると、入力が blur されて IME が確定し、保存後に `/MemoList` へ遷移する。

### Requirement: Memo List (All) frontend filtering

- The Memo List All view at `/MemoListAll` SHOULD allow filtering by date and by theme, only enabling selectable dates that have memos. Image content (data URLs) MUST render as images; other content MUST render as plain text extracted from paragraphs.
- It MUST show loading, error, and empty states appropriately.
- JA: メモ一覧（全件）のフロントエンドフィルタ
- JA: `/MemoListAll` では日付・テーマでの絞り込みを提供し、メモのある日付のみ選択可能にするべきである。画像データは画像として、それ以外は段落テキストを抽出して表示しなければならない。ローディング/エラー/空状態の表示も行わなければならない。

#### Scenario: Filter by date and theme

- Given a set of memos across multiple dates and themes
- When a date and a theme are selected
- Then only memos matching both filters are displayed with correct formatting
- JA: 複数日・複数テーマのメモがあるとき、日付とテーマを選ぶと、両方に一致するメモのみが適切に整形されて表示される。

