# feat: Supabase RLSセキュリティポリシーを実装

## 🔒 概要
Supabaseのセキュリティ対策を強化し、Row Level Security（RLS）とSQLベースのポリシー管理を実装しました。

## ✨ 主な変更内容

### セキュリティ機能の追加
- **Row Level Security (RLS)** を全テーブル（`memos`, `user_settings`, `themes`）で有効化
- **認証ユーザーのみアクセス** に制限し、匿名ユーザーのデータベースアクセスを完全にブロック
- **SQLベースのポリシー管理** を実装し、GUIに依存しない管理方式を採用

### 実装されたポリシー
- **memos**: ユーザーは自分のメモのみ読み取り・作成・更新・削除可能
- **user_settings**: ユーザーは自分の設定のみアクセス可能
- **themes**: 認証ユーザーのみ読み取り可能（メモ作成時に必要）

### 追加されたファイル
- `supabase/migrations/20241230000000_add_security_policies.sql` - セキュリティポリシーのマイグレーション
- `supabase/policies.sql` - ポリシー管理用SQLスクリプト
- `supabase/scripts/apply-policies.sh` - ポリシー適用スクリプト（macOS/Linux）
- `supabase/scripts/check-policies.sh` - ポリシー確認スクリプト（macOS/Linux）
- `supabase/scripts/apply-policies.ps1` - ポリシー適用スクリプト（Windows PowerShell）
- `supabase/scripts/check-policies.ps1` - ポリシー確認スクリプト（Windows PowerShell）
- `supabase/scripts/apply-policies.bat` - ポリシー適用スクリプト（Windows バッチ）
- `supabase/SECURITY.md` - セキュリティ設定の詳細ドキュメント
- `check_policies.sql` - ポリシー確認用SQLクエリ

### 更新されたファイル
- 既存のマイグレーションファイルにRLSと権限設定を追加
- `README.md` にセキュリティ設定手順を追加（Windows対応含む）

## 🖥️ 使用方法

### macOS/Linux
```bash
# ポリシーの適用
./supabase/scripts/apply-policies.sh

# ポリシーの確認
./supabase/scripts/check-policies.sh
```

### Windows
```powershell
# PowerShellを使用する場合
.\supabase\scripts\apply-policies.ps1
.\supabase\scripts\check-policies.ps1

# または、バッチファイルを使用する場合
.\supabase\scripts\apply-policies.bat
```

### 共通コマンド
```bash
# 本番環境へのデプロイ
supabase db push
```

## 🧪 テスト方法

1. **認証なしでのアクセス**: ログインせずにデータにアクセスしようとすると拒否されることを確認
2. **認証ありでのアクセス**: ログインして自分のデータに正常にアクセスできることを確認
3. **他ユーザーのデータアクセス**: 別ユーザーでログインして同じデータにアクセスしようとすると拒否されることを確認

## 🔒 セキュリティ効果

- ✅ ユーザーは自分のデータのみアクセス可能
- ✅ 匿名ユーザーはデータベースアクセス不可
- ✅ 全CRUD操作が適切にセキュア化
- ✅ ポリシーがバージョン管理され、デプロイ可能
- ✅ GUIに依存しないSQLベースの管理
- ✅ クロスプラットフォーム対応（macOS/Linux/Windows）

## ⚠️ 注意事項

- この変更により、認証されていないユーザーはデータベースにアクセスできなくなります
- 既存のデータがある場合は、ポリシー適用前にバックアップを取得することを推奨します
- 本番環境へのデプロイ前に、開発環境で十分にテストしてください
- Windows環境では、PowerShellまたはバッチファイルを使用してください

## 🔗 関連ドキュメント

詳細なセキュリティ設定については `supabase/SECURITY.md` を参照してください。
