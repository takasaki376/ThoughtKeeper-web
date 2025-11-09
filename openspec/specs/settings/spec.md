# settings Specification

## Purpose
TBD - created by archiving change add-baseline-specs-existing-features. Update Purpose after archive.
## Requirements
### Requirement: Get and initialize user settings

- `GET /api/settings` SHALL return the caller’s settings from `user_settings` by `user_id`.
- If not present, the API MUST insert defaults `{ theme_count: 10, time_limit: 60 }` and return 201 with `{ message }`.
- Unauthorized requests MUST return 401.
- JA: ユーザー設定の取得と初期化
- JA: `GET /api/settings` は `user_id` に対応する `user_settings` の設定を返さなければならない。存在しない場合はデフォルト `{ theme_count: 10, time_limit: 60 }` を挿入し、201 と `{ message }` を返さなければならない。未認証は 401 を返さなければならない。

#### Scenario: Return existing settings

- Given a valid session and existing record in `user_settings`
- When requesting `GET /api/settings`
- Then respond 200 with `{ theme_count, time_limit, last_selected_input_type? }`
- JA: セッションが有効で `user_settings` にレコードがある場合、`GET /api/settings` は 200 と設定（`theme_count`, `time_limit`, `last_selected_input_type?`）を返す。

#### Scenario: Initialize missing settings with defaults

- Given a valid session with no settings row
- When requesting `GET /api/settings`
- Then insert defaults and respond with 201 and `{ message: 'Initial settings created' }`
- JA: 設定が存在しない有効セッションで `GET /api/settings` を呼ぶと、デフォルトを挿入し 201 と `{ message: 'Initial settings created' }` を返す。

### Requirement: Upsert settings

- `PUT /api/settings` MUST upsert per-user settings. It SHALL accept partial fields: `{ theme_count?, time_limit?, last_selected_input_type? }`.
- It MUST return the updated row with `{ message: 'Settings updated successfully', ...row }`.
- Unauthorized requests MUST return 401.
- JA: ユーザー設定のアップサート
- JA: `PUT /api/settings` はユーザー設定をアップサートしなければならない。`{ theme_count?, time_limit?, last_selected_input_type? }` の部分更新を受け付け、成功時は `{ message: 'Settings updated successfully', ...row }` を返し、未認証は 401 を返さなければならない。

#### Scenario: Update theme_count and time_limit

- Given a valid session
- When putting `{ theme_count, time_limit }` to `/api/settings`
- Then upsert the row and respond 200 with the updated data and success message
- JA: 有効なセッションで `{ theme_count, time_limit }` を PUT すると、レコードがアップサートされ、200 と更新後データ/成功メッセージが返る。

### Requirement: Settings page UI

- The Settings page SHALL display and update `theme_count` and `time_limit` with optimistic UI and server reconciliation.
- It MUST allow password change using the password update API with validation and feedback messages.
- JA: 設定ページ UI
- JA: 設定ページは `theme_count` と `time_limit` を楽観更新で表示/更新し、サーバーと整合させなければならない。また、パスワード更新 API を用いたパスワード変更を提供し、検証とメッセージ表示を行わなければならない。

#### Scenario: Adjust settings and persist

- Given settings are loaded
- When the user changes values and blurs/commits
- Then reflect the change immediately and sync to `/api/settings`, showing final values after server response
- JA: 設定が読み込まれた状態で値を変更して確定すると、即時反映され、その後 `/api/settings` へ同期され、サーバー応答に基づく最終値が表示される。

