# frontend Specification

## Purpose
Baseline of existing frontend features and UI flows. Serves as current truth for validation and future iteration.

## Requirements

### Requirement: App shell providers and header
- The authenticated layout SHALL wrap pages with `Jotai` Provider and `MantineProvider`, and MUST render a top header with site title, auth control, and a settings button.
- Clicking the site title in the header MUST navigate to `/`.
- JA: 認証済みレイアウトは `Jotai` プロバイダと `MantineProvider` で子要素をラップし、サイトタイトル・認証ボタン・設定ボタンを含むヘッダーを表示しなければならない。ヘッダーのサイトタイトルをクリックすると `/` に遷移しなければならない。
#### Scenario: Header renders and links to home
- Given an authenticated page is loaded
- When the header is displayed
- Then clicking the site title navigates to `/`
- JA: 認証済みページでヘッダーが表示されているとき、サイトタイトルをクリックすると `/` に遷移する。

### Requirement: Home navigation shortcuts
- The home page in `(authenticated)` SHALL present three primary actions that MUST navigate to `/ThemeSelect`, `/MemoListAll`, and `/setting`.
- JA: `(authenticated)` のホームでは、`/ThemeSelect`・`/MemoListAll`・`/setting` への3つの主要アクションを表示し、各リンクに遷移しなければならない。
#### Scenario: Navigate via primary buttons
- Given the home page is visible
- When the user clicks each action
- Then the router navigates to the corresponding route
- JA: ホームで各アクションをクリックすると、対応するルートへ遷移する。

### Requirement: Theme selection UI
- The Theme Select page SHALL load all themes and MUST randomly select N = `theme_count` (default 10) for the session.
- It MUST show a loading indicator while fetching and an error message on failure.
- The Start button MUST navigate to `/MemoEditor`.
- JA: テーマ選択ページは全テーマを読み込み、セッションごとに N = `theme_count`（既定10）件をランダム選択しなければならない。取得中はローディングを表示し、失敗時はエラーメッセージを表示しなければならない。開始ボタンで `/MemoEditor` に遷移しなければならない。
#### Scenario: Start after selection
- Given themes are loaded and displayed
- When the user clicks Start
- Then navigate to `/MemoEditor`
- JA: テーマが表示されている状態で開始を押すと `/MemoEditor` に遷移する。

### Requirement: Memo editor tabs and inputs
- The Memo Editor SHALL provide two tabs: text editor and drawing canvas.
- The text tab MUST use TipTap (StarterKit) and propagate content via `onChange`.
- The drawing tab MUST allow freehand drawing on a canvas and propagate Base64 PNG data on stroke end; changing the theme MUST clear the canvas.
- JA: メモエディターはテキストと描画の2タブを提供しなければならない。テキストタブは TipTap（StarterKit）を用い、`onChange` で内容を渡さなければならない。描画タブはキャンバスに自由描画でき、ストローク終了時に Base64 PNG を渡さなければならない。テーマ変更時はキャンバスをクリアしなければならない。
#### Scenario: Switch between tabs and edit
- Given the editor is visible
- When switching tabs and editing content
- Then the corresponding `onChange` handlers receive updated content
- JA: エディターでタブを切り替えて編集すると、各 `onChange` に更新内容が渡る。

### Requirement: Per-theme countdown and auto-save
- The editor SHALL display remaining time and MUST auto-save on countdown expiry per theme, using `/api/memos`.
- After save, it MUST advance to the next theme; after the final theme, it MUST navigate to `/MemoList`.
- JA: エディターは残り時間を表示し、各テーマでカウントダウン満了時に `/api/memos` で自動保存しなければならない。保存後は次のテーマへ進み、最後なら `/MemoList` に遷移しなければならない。
#### Scenario: Auto-save and advance flow
- Given the timer reaches zero
- When auto-save completes
- Then the next theme becomes active or navigation occurs to `/MemoList` if the last theme
- JA: タイマーが0になり保存が完了すると、次のテーマへ進むか、最後なら `/MemoList` に遷移する。

### Requirement: Memo list rendering
- The Memo List page SHALL render latest memo per theme, formatting text content to plain lines and rendering image content when `content` is a data URL.
- Empty themes MUST render an explicit empty state with timestamp and theme name.
- JA: メモ一覧はテーマごとの最新メモを表示し、テキストはプレーンな行に整形し、`content` がデータURLの場合は画像として描画しなければならない。メモがないテーマは時刻とテーマ名付きの空状態を明示的に表示しなければならない。
#### Scenario: Render text vs image entries
- Given memo entries include both HTML text and Base64 images
- When listing items
- Then text entries are stripped into plain lines and image entries are shown as images
- JA: テキストと画像のメモが混在する場合、テキストは整形して表示し、画像は画像として表示される。

### Requirement: Settings UI interactions
- The Settings page SHALL present numeric inputs for `theme_count` and `time_limit`, and MUST perform optimistic updates with server reconciliation via `/api/settings`.
- It MUST provide a password change form with live match feedback and disable submit on invalid state.
- JA: 設定ページは `theme_count` と `time_limit` の数値入力を提供し、`/api/settings` と整合を取る楽観的更新を行わなければならない。パスワード変更フォームは一致確認のライブフィードバックを提供し、無効状態では送信を無効化しなければならない。
#### Scenario: Update and persist settings
- Given current settings are loaded
- When the user changes values and blurs
- Then the UI updates immediately and the server is updated; errors revert or show feedback
- JA: 値を変更してフォーカスを外すと即時に反映され、サーバー更新が行われ、失敗時は取り消すかエラー表示を行う。

### Requirement: Auth and password reset UI
- The Login page SHALL include email/password inputs, Sign In and Sign Up actions, and a link to `/auth/reset-password`.
- The Reset Password page MUST validate email format and call `/api/auth/reset-password`; the Confirm page MUST validate strength and match, and call the update flow.
- JA: ログイン画面はメール/パスワード入力、サインイン/サインアップ、`/auth/reset-password` へのリンクを提供しなければならない。パスワードリセット画面はメール形式を検証して `/api/auth/reset-password` を呼び、確認画面は強度と一致を検証して更新フローを呼び出さなければならない。
#### Scenario: Trigger reset and complete update
- Given the user requests a reset and follows the link
- When a valid new password is submitted on the confirm page
- Then success feedback is shown or navigation proceeds per flow
- JA: リセット要求からリンク経由で確認画面に到達し、有効な新パスワードを送信すると、成功メッセージが表示されるか、フローに応じて遷移が行われる。

### Requirement: Data fetching and state
- The frontend SHALL use `ky` for client HTTP and `swr` for memo/settings data fetching and caching.
- Global UI state for themes and user MUST be stored with Jotai atoms; theme selection MUST set chosen themes into global state.
- JA: フロントエンドは HTTP に `ky` を、メモ/設定の取得とキャッシュに `swr` を用いなければならない。テーマやユーザーのグローバル状態は Jotai の atom で保持し、テーマ選択時に選択結果を保存しなければならない。
#### Scenario: SWR + Jotai integration
- Given themes are fetched
- When Theme Select commits a random set
- Then the Jotai atom contains the selected themes for subsequent pages
- JA: テーマ取得後、選択を確定すると、Jotai のアトムに選択テーマが格納される。

### Requirement: Persist last selected input type
- On tab change between text and drawing, the app SHALL persist the selection to settings via `/api/settings` as `last_selected_input_type`.
- On next editor open, the previously selected input type MUST be restored as the active tab.
- JA: テキストと描画のタブ切り替え時に、`/api/settings` へ `last_selected_input_type` を保存しなければならない。次回エディター表示時には以前の選択を復元し、アクティブなタブにしなければならない。
#### Scenario: Save and restore input type
- Given the user switches from text to drawing
- When the editor is reopened later
- Then the drawing tab is active initially based on saved settings
- JA: テキストから手書きに切り替えて保存後、再度エディターを開くと手書きタブが初期表示になる。

### Requirement: Focus management and composition handling
- When switching to the text tab, the TipTap editor SHALL receive focus automatically if present.
- Before auto-save on timer expiry, the app MUST blur the active element and wait briefly (e.g., ~100ms) to ensure IME composition is committed.
- JA: テキストタブでは TipTap に自動でフォーカスしなければならない。タイマー満了の自動保存前にフォーカスを外し、IME 変換の確定のため短時間待機しなければならない。
#### Scenario: Prevent partial IME save
- Given the user is composing text with IME when timer ends
- When the app blurs and waits briefly
- Then the committed text is saved rather than intermediate composition
- JA: タイマー終了時にフォーカスを外して短時間待機することで、変換途中ではなく確定済みのテキストが保存される。

### Requirement: Date and theme filtering in full list
- The full list view (`/MemoListAll`) SHALL provide a date picker that enables only dates that have memos and a clear action to reset the filter.
- It SHALL also provide a theme select that filters the list by theme and MUST show a count `(filtered/total)`.
- JA: `/MemoListAll` はメモがある日付のみを選択可能にする日付ピッカーと、クリア操作を提供しなければならない。テーマ選択による絞り込みと `(filtered/total)` の件数表示も行わなければならない。
#### Scenario: Filter by date and theme
- Given memos exist across multiple dates and themes
- When selecting a date with memos and a theme
- Then only matching memos are shown and the count reflects `(filtered/total)`
- JA: 複数の日付とテーマにメモがある場合、日付とテーマを選ぶと一致するメモのみ表示され、件数が `(filtered/total)` で表示される。

### Requirement: Local time formatting
- The list views SHALL format dates/times in the user’s local timezone.
- JA: 一覧表示ではユーザーのローカルタイムゾーンで日付/時刻をフォーマットしなければならない。
#### Scenario: Localized timestamps
- Given a memo timestamp in UTC
- When rendered in the list
- Then the displayed time corresponds to the user’s local timezone
- JA: UTC のタイムスタンプがユーザーのローカルタイムゾーンの時刻で表示される。

### Requirement: Canvas persistence and clear on theme change
- The drawing canvas SHALL restore the previous image when provided `value` and MUST clear when the theme changes.
- JA: 描画キャンバスは `value` が与えられた場合に前回の画像を復元し、テーマ変更時にはクリアしなければならない。
#### Scenario: Restore previous drawing
- Given a saved drawing encoded as a data URL
- When the editor loads the drawing tab
- Then the image is drawn onto the canvas
- JA: データURLで保存された描画が、エディターの読み込み時にキャンバスへ描画される。

