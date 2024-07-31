# Используем базовый образ для Node.js
FROM node:20-alpine AS build_image

# Установка рабочей директории
WORKDIR /app

# Копирование package.json и pnpm-lock.yaml для установки зависимостей
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Установка pnpm
RUN npm install -g pnpm

# Копирование всех исходных файлов
COPY . .

# Установка зависимостей
RUN pnpm install

# Проверка структуры директорий до сборки
RUN echo "Checking directory structure before build:" && \
    ls -la /app && \
    ls -la /app/examples && \
    ls -la /app/examples/blog-app

# Строим проект и проверяем структуру директорий после сборки
RUN pnpm run blog:build:prod && \
    echo "Build completed, checking directory structure:" && \
    ls -la /app/examples/blog-app && \
    ls -la /app/examples/blog-app/dist

# Базовый образ для выполнения
FROM node:20-alpine AS run_image

# Установка рабочей директории
WORKDIR /app

# Копирование только необходимых файлов из предыдущего этапа сборки
COPY --from=build_image /app/examples/blog-app/dist /app

# Открытие порта 80
EXPOSE 80

# Запуск сервера
CMD ["node", "server.js"]