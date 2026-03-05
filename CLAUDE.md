# Task Board

## コミュニケーション
- 常に日本語で応答すること

## プロジェクト概要
Trelloライクなタスク管理SaaS。カンバンボードでタスクをドラッグ&ドロップで管理できる。

## 技術スタック
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- SQLite（prisma経由）
- 認証: NextAuth.js

## 開発ルール
- コミットメッセージは日本語で
- anyの使用禁止
- コンポーネントは機能単位でディレクトリを分ける

## コマンド
- npm run dev → 開発サーバー起動（ポート3001）
- npm run build → ビルド
- npx prisma studio → DB確認
