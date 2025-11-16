# themes Specification

## Purpose
TBD - created by archiving change add-baseline-specs-existing-features. Update Purpose after archive.
## Requirements
### Requirement: List themes API

- `GET /api/themes` SHALL return available themes.
- The response MUST be an array of `{ id, title, theme }`.
- JA: テーマ一覧 API
- JA: `GET /api/themes` は利用可能なテーマを返さなければならない。レスポンスは `{ id, title, theme }` の配列でなければならない。

#### Scenario: Fetch themes successfully

- Given themes exist in the database
- When requesting `GET /api/themes`
- Then respond 200 with an array of themes
- JA: データベースにテーマが存在する場合、`GET /api/themes` で 200 とテーマ配列が返る。

### Requirement: Create theme API (authenticated)

- `POST /api/themes` MUST require an authenticated user and accept `{ theme_name }`.
- On success it MUST return 200 with the created row and a success message; unauthorized requests MUST receive 401.
- JA: テーマ作成 API（要認証）
- JA: `POST /api/themes` は認証済みユーザーを必須とし、`{ theme_name }` を受け付けなければならない。成功時は 200 と作成行/メッセージ、未認証は 401 を返さなければならない。

#### Scenario: Create a theme when logged in

- Given a valid session
- When posting `{ theme_name }` to `/api/themes`
- Then insert a theme row and return the created item with a message
- JA: セッションが有効な状態で `{ theme_name }` を POST すると、テーマが作成され、作成結果とメッセージが返る。

### Requirement: Theme selection page

- The Theme Select view SHALL fetch all themes and randomly select N themes where N is from user settings (`theme_count`, default 10).
- It MUST display the selected themes and provide a Start button that navigates to the Memo Editor.
- JA: テーマ選択ページ
- JA: テーマ選択画面は全テーマを取得し、ユーザー設定の `theme_count`（既定 10）に従ってランダムに N 件選択しなければならない。選択結果を表示し、メモエディターへ遷移する開始ボタンを提供しなければならない。

#### Scenario: Randomly select configured number of themes

- Given themes are loaded and a configured `theme_count`
- When opening the Theme Select page
- Then display a randomly selected set of themes of size `theme_count` and enable navigation to `/MemoEditor` on Start
- JA: テーマが読み込まれ `theme_count` が設定されているとき、テーマ選択ページでは `theme_count` 件のランダム選択を表示し、開始ボタンで `/MemoEditor` へ遷移できる。

