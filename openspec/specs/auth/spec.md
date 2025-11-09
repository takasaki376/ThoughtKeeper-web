# auth Specification

## Purpose
TBD - created by archiving change add-baseline-specs-existing-features. Update Purpose after archive.
## Requirements
### Requirement: Server-side authentication with protected routes

- The `(authenticated)` layout SHALL require a valid Supabase session, and unauthenticated requests MUST be redirected to `/auth/login`.
- The server-side code MUST use `createSupabaseServerClient` with cookie-based session management.
- JA: サーバーサイド認証と保護ルート
- JA: `(authenticated)` レイアウトは有効な Supabase セッションを必須とし、未認証リクエストは `/auth/login` にリダイレクトしなければならない。
- JA: サーバー側コードは `createSupabaseServerClient` を用い、Cookie ベースのセッションを扱わなければならない。
- JA: `(authenticated)` レイアウトは有効な Supabase セッションを必須とし、未認証リクエストは `/auth/login` にリダイレクトしなければならない。
- JA: サーバー側コードは `createSupabaseServerClient` を用い、Cookie ベースのセッションを扱わなければならない。

#### Scenario: Redirect unauthenticated users to login

- Given no active session
- When requesting a page under `src/app/(authenticated)/*`
- Then respond with a redirect to `/auth/login`
- JA: セッションがない場合に、`src/app/(authenticated)/*` 配下のページにアクセスすると、`/auth/login` へリダイレクトされる。

### Requirement: Email/password sign-in and sign-up

- The login page SHALL provide Sign In and Sign Up using Supabase Auth.
- On successful sign-in, the app MUST redirect to `/`. Sign-up MUST trigger an email flow that redirects back via `/auth/callback`.
- JA: メール/パスワードによるサインイン/サインアップ
- JA: ログインページは Supabase Auth を用いたサインイン/サインアップを提供しなければならない。サインイン成功時は `/` へリダイレクトし、サインアップ時は `/auth/callback` 経由で戻るメールフローを開始しなければならない。

#### Scenario: Successful sign-in redirects home

- Given valid email and password are submitted from `/auth/login`
- When Supabase returns a user object
- Then redirect to `/`
- JA: `/auth/login` から有効なメールとパスワードを送信し、Supabase がユーザーを返した場合、`/` にリダイレクトされる。

#### Scenario: Sign-up initiates email flow

- Given email and password are submitted to sign up
- When Supabase returns success
- Then redirect to `/auth/login?message=Check email to continue sign in process`
- JA: サインアップでメールとパスワードを送信し成功した場合、`/auth/login?message=...` にリダイレクトされ、メール確認フローが開始される。

### Requirement: Auth callback exchanges code and redirects

- `/auth/callback` MUST exchange the `code` for a session using Supabase and then redirect to the site origin root (`/`).
- JA: 認証コールバックでコード交換しリダイレクト
- JA: `/auth/callback` は `code` を Supabase でセッションに交換し、サイトのルート（`/`）へリダイレクトしなければならない。

#### Scenario: Exchange auth code for session

- Given a GET to `/auth/callback?code=...`
- When the code is valid
- Then create a session and redirect to `/`
- JA: `/auth/callback?code=...` にアクセスし、コードが有効な場合、セッションが作成され `/` にリダイレクトされる。

### Requirement: Fetch current user via API

- `GET /api/auth/user` SHALL return `{ user }` when available; on failure it MUST return `{ error }` with 500.
- JA: API で現在のユーザーを取得
- JA: `GET /api/auth/user` は利用可能なら `{ user }` を返し、失敗時は 500 と `{ error }` を返さなければならない。

#### Scenario: Return current user JSON

- Given a valid session
- When requesting `GET /api/auth/user`
- Then respond with status 200 and body `{ user: { id, email? } }`
- JA: 有効なセッションがある場合に `GET /api/auth/user` を呼び出すと、ステータス 200 で `{ user: { id, email? } }` が返る。

### Requirement: Password reset email initiation

- `POST /api/auth/reset-password` MUST accept `{ email }` and send a Supabase password reset email with `redirectTo=/auth/reset-password/confirm`.
- On success, it MUST return 200 with `{ message }`; on validation error it MUST return 400; on unexpected error it MUST return 500.
- JA: パスワードリセットメールの送信
- JA: `POST /api/auth/reset-password` は `{ email }` を受け取り、`redirectTo=/auth/reset-password/confirm` でパスワードリセットメールを送信しなければならない。成功時は 200 と `{ message }`、バリデーション失敗は 400、予期しない失敗は 500 を返さなければならない。

#### Scenario: Send reset email with redirect

- Given a valid email
- When posting to `/api/auth/reset-password`
- Then Supabase sends a reset email and the response is 200 with a success message
- JA: 有効なメールで `/api/auth/reset-password` に POST すると、リセットメールが送信され、レスポンスは 200 と成功メッセージになる。

### Requirement: Password update via API

- `POST /api/auth/update-password` MUST accept `{ password, confirmPassword }` and update the password for the current session user.
- Validations MUST include presence, match, minimum length (8+), and a basic strength regex (lowercase, uppercase, number). On validation failure, the API MUST return 400 with `{ error }`.
- JA: API によるパスワード更新
- JA: `POST /api/auth/update-password` は `{ password, confirmPassword }` を受け取り、現在のセッションユーザーのパスワードを更新しなければならない。必須・一致・8 文字以上・英小文字/英大文字/数字の強度を検証し、失敗時は 400 と `{ error }` を返さなければならない。

#### Scenario: Update password after validation

- Given a valid session and valid new password
- When posting to `/api/auth/update-password`
- Then the password is updated and the response is 200 with `{ message: 'Password updated successfully' }`
- JA: 有効なセッション下で妥当な新パスワードを `/api/auth/update-password` に POST すると、パスワードが更新され 200 と成功メッセージが返る。

### Requirement: Password reset confirmation page

- `/auth/reset-password/confirm` SHALL allow setting a new password. It MUST support both `code`-based session exchange and token/type flow, and call Supabase `auth.updateUser`.
- JA: パスワードリセット確認ページ
- JA: `/auth/reset-password/confirm` は新しいパスワードの設定を許可し、`code` ベースのセッション交換と token/type フローの双方をサポートし、`auth.updateUser` を呼び出さなければならない。

#### Scenario: Complete reset in confirmation page

- Given the user reached `/auth/reset-password/confirm` from the email link
- When a valid password is submitted
- Then update the user’s password and provide success feedback or error messaging
- JA: メールリンクから `/auth/reset-password/confirm` に到達し、有効なパスワードを送信すると、パスワードが更新され、成功/失敗のメッセージが表示される。

