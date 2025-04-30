# ベースイメージ
FROM node:18

# 作業ディレクトリを設定
WORKDIR /usr/src/app

# package.json と package-lock.json をコピー
COPY package*.json ./

# 依存関係をインストール
RUN npm install

# アプリケーションコードをコピー
COPY . .

# ビルド
RUN npm run build

# アプリケーションを起動
CMD ["npm", "run", "start:dev"]