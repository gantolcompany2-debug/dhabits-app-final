FROM node:22-alpine

WORKDIR /app

# Установить pnpm
RUN npm install -g pnpm

# Копировать файлы проекта
COPY package.json pnpm-lock.yaml ./
COPY client ./client
COPY server ./server
COPY shared ./shared
COPY vite.config.ts tsconfig.json tsconfig.node.json ./
COPY patches ./patches

# Установить зависимости и собрать проект
RUN pnpm install --frozen-lockfile
RUN pnpm build

# Открыть порт
EXPOSE 3000

# Запустить приложение
CMD ["node", "dist/index.js"]
