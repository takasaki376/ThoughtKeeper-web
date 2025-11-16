• 目的

- OpenSpec を npm グローバル CLI として Windows 環境に導入し、動作確認まで行う。

対象

- リポジトリ: https://github.com/Fission-AI/OpenSpec/
- 環境: Windows（PowerShell）、Node.js/npm 利用

前提準備

- Node.js 18 以上・npm 9 以上を用意（node -v, npm -v）
- 企業ネットワークの場合は npm のプロキシ設定を確認（必要なら npm config set proxy ...）

導入パス 1: npm レジストリからグローバル導入（推奨）

- パッケージ名の確認
  - 公式 README の npm バッジまたは package.json 記載の公開名を確認
  - 一般的な想定名は openspec（相違がある場合は README の正正式名を使用）
- インストール
  - npm i -g openspec（または README 記載の正確なパッケージ名）
- 動作確認
  - Get-Command openspec で検出確認
  - openspec --version でバージョン表示を確認  


導入パス 2: GitHub から直接グローバル導入（レジストリ未公開/最新版が必要な場合）

- 直接インストール（リポジトリ直下が publish 可能な場合）
  - npm i -g github:Fission-AI/OpenSpec
- モノレポ構成（CLI がサブディレクトリの場合）
  - クローン: git clone https://github.com/Fission-AI/OpenSpec.git
  - CLI パッケージへ移動（例）: cd OpenSpec\packages\cli
  - 依存解決: npm ci（または npm i）
  - グローバル導入: npm i -g .（または開発リンク npm link）
- 動作確認
  - Get-Command openspec
  - openspec --version  


PATH の確認（見つからない場合）

- npm グローバルの prefix を確認: npm config get prefix
- Windows の既定例: C:\Users\<User>\AppData\Roaming\npm
- 上記パスが環境変数 Path に含まれるか確認。含まれない場合は追加し、新しいターミナルで再実行。  


権限/セキュリティ

- 通常は管理者不要（ユーザープロファイル配下にインストール）
- 権限エラー時は PowerShell を管理者で起動し再試行  


アンインストール（ロールバック）

- レジストリ導入/ローカル導入共通: npm uninstall -g openspec
- npm cache verify（任意）でキャッシュ整合性を確認  


トラブルシュート

- コマンドが見つからない: 新しいターミナルで再試行 → Get-Command openspec → npm config get prefix と PATH を確認
- ネットワーク/プロキシ: npm config get proxy / npm config set proxy http://...（必要に応じて https-proxy も設定）
- バージョン差異: npm ls -g --depth=0 でインストール済みバージョン確認、必要なら再インストール
- モノレポで直下インストールが失敗: サブディレクトリの CLI パッケージに移動して npm i -g . を実行  


完了条件

- openspec --version が正常にバージョンを表示
- PowerShell で Get-Command openspec が解決先（AppData\Roaming\npm\openspec 等）を指していることを確認  


必要なら、実際の CLI 実行コマンド名（openspec 以外の可能性）を README の bin 設定に合わせて更新します。
