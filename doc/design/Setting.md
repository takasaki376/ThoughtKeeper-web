# Setting 設計書

## 1. 概要
- 目的: ユーザーの編集体験に関わるアプリ設定（テーマ件数・制限時間）を編集できるページを提供する。
- 対象ファイル: `src/app/(authenticated)/setting/page.tsx`, `src/app/(authenticated)/setting/privacy/page.tsx`
- ルート: Next.js App Router の `(authenticated)` グループ配下の `setting` ページとその下位ページ。

## 2. UI 構成（SettingPage）
- ヘッダー相当
  - 右上に閉じるアイコン（`MdOutlineClose`）リンクでホーム（`/`）へ遷移。
- 設定フォーム
  - テーマ件数入力
    - ラベル: テーマ件数
    - 入力: `NumberInput`（最小 1、最大 100、整数のみ、範囲外クランプ）
    - 単位表示: 件
    - ヘルプテキスト: テーマの出題数を設定
  - 入力時間（制限時間）
    - ラベル: 入力する時間
    - 入力: `NumberInput`（最小 1、最大 3600、整数のみ、範囲外クランプ）
    - 単位表示: 秒
    - ヘルプテキスト: テーマごとの制限時間を設定
- ローディング/エラー
  - 読込中: `Loader` を表示
  - 取得エラー: エラーメッセージ表示

レイアウトは Tailwind クラスで構成（枠シャドウ、レスポンシブ 1/3 + 2/3 の 2 カラム等）。

## 3. コンポーネント/ロジック（SettingPage）
- データ取得/更新
  - `useSettings()` で `{ settings, isLoading, error, updateSettings }` を取得。
  - 既定値: `theme_count = 10`, `time_limit = "60"`（取得できない場合のフォールバック）。
  - 更新時は `updateSettings` に部分オブジェクトを渡す（例: `{ theme_count: number }`, `{ time_limit: string }`）。
- 入力コンポーネント: `InputTargetCount`
  - Props: `value: number`, `onUpdate(count: number)`
  - 内部状態 `localCount` を持つ。`value` 変更で同期。
  - `onChange` で数値化して `localCount` 更新。
  - `onBlur` で親の値と差分がある場合のみ `onUpdate(localCount)` 実行（不要な更新を抑制）。
  - `NumberInput` 設定: `min=1`, `max=100`, `allowDecimal=false`, `clampBehavior="strict"`。
- 入力コンポーネント: `InputTargetTime`
  - Props: `value: string`, `onUpdate(time: string)`
  - 内部状態 `localTime` を持つ。`value` 変更で同期。
  - `onChange` で文字列化して `localTime` 更新。
  - `onBlur` で親の値と差分がある場合のみ `onUpdate(localTime)` 実行。
  - `NumberInput` 設定: `min=1`, `max=3600`, `allowDecimal=false`, `clampBehavior="strict"`。表示値は `Number(localTime)`。
- フォーム動作
  - `onSubmit` は `preventDefault()` でページ遷移を抑止。更新は各入力の `onBlur` により逐次反映。

## 4. エラーハンドリング/状態遷移
- `isLoading` true: 設定 UI を表示せず `Loader` を返す。
- `error` あり: エラーメッセージを返す。
- 正常系: 取得済み設定値を各入力の初期値として表示。

## 5. 依存関係
- ライブラリ: `react`, `@mantine/core`（`NumberInput`）, `next/link`, `react-icons/md`
- 自作: `useSettings`, `Loader`

## 6. アクセシビリティ/UX
- ラベルに `htmlFor` と入力 `id` を対応付け。
- 数値入力は範囲と整数制約を UI/ロジック両面で担保（Clamp + allowDecimal=false）。
- `onBlur` 更新によりタイピング中の不要 API 呼び出しを回避。
- 閉じるアイコンで明確にページ離脱可能。

## 7. 受け入れ条件（例）
- 初回表示時、既存設定が読み込まれ、値が反映される。取得中はローダーが表示される。
- テーマ件数・時間のいずれかを変更してフォーカスを外すと、API 更新が行われ、再描画で新値が反映される。
- 設定値は指定範囲外にできない（UI でクランプされる）。
- 閉じるボタン押下でトップページに遷移する。

---

# PrivacyPage 設計（簡易）

## 1. 概要
- 目的: プライバシーポリシー表示用のプレースホルダーページ。
- 対象ファイル: `src/app/(authenticated)/setting/privacy/page.tsx`

## 2. 仕様
- サーバーコンポーネント（`async function` だが現状非同期処理はなし）。
- 表示内容: `div.text-gray` 内に `PrivacyPage` という静的テキストを表示。
- 追加の状態・ロジック・依存はなし（今後コンテンツ差し替え前提）。

## 8. パスワード変更/リセット（Setting ページ）

- 対象ファイル: `src/app/(authenticated)/setting/page.tsx:1`, `src/hooks/usePasswordReset.ts:1`, `src/app/api/auth/update-password/route.ts:1`
- 目的: 認証済みユーザーが設定画面から直接パスワードを変更できるようにする。

### UI/挙動
- 入力欄: 新しいパスワード、パスワード確認（どちらも `type="password"`）。
- ボタン: 「パスワードを変更」。以下の条件で無効化:
  - 更新中（`isPasswordUpdating`）/ どちらか未入力 / 不一致。
- リアルタイム一致判定: 確認欄の入力に応じて「一致/不一致」のメッセージを表示。
- ガイド: 以下の要件をリスト表示し、満たすよう促す。
  - 8文字以上
  - 小文字を含む
  - 大文字を含む
  - 数字を含む
- 成否表示: 成功時は緑背景メッセージ、失敗時は赤背景メッセージを表示。成功時は入力欄をクリア。

### クライアント処理
- `usePasswordReset.updatePassword(password, confirmPassword)` を呼び出し、`/api/auth/update-password` に POST。
- フックは `isLoading/error/success` を提供。画面側はこれに連動してボタンの無効化・メッセージ表示・フォームクリアを制御。

### サーバー/API
- エンドポイント: `POST /api/auth/update-password`（`src/app/api/auth/update-password/route.ts:1`）。
- バリデーション:
  - `password`/`confirmPassword` 必須。
  - 一致チェック。
  - 長さ 8 文字以上。
  - 強度チェック: 正規表現 `^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)` を満たすこと（小文字/大文字/数字を各1つ以上）。
- 更新処理: `supabase.auth.updateUser({ password })` を実行。エラー時は 400、成功時はメッセージを返却。

### 想定ユースケース/注意
- この機能は「ログイン済みの本人による直接変更」を想定（メールによるリンク確認は不要）。
- メール経由のリセットフローは別途 `/auth/reset-password`（確認は `/auth/reset-password/confirm`）で提供されるが、Setting ページの範囲外。
- 既存パスワードと同一の設定など、プロバイダ側で拒否されるケースは API エラーメッセージとして返却される。

### 受け入れ条件
- 不一致時はボタンが無効化され、送信できない。
- 要件を満たさない入力は API で 400 が返り、エラーメッセージが表示される。
- 要件を満たす一致した入力で送信すると、成功メッセージが表示され、両入力欄がクリアされる。
- 更新中はボタン・入力欄が適切に無効化される。
