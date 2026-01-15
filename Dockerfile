FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN npm install -g pnpm@9 && \
    pnpm install --frozen-lockfile

COPY . .

ARG BASE_URL=/
ENV BASE_URL=${BASE_URL}

RUN pnpm run build

FROM node:20-alpine

WORKDIR /app

RUN addgroup -S docusaurus && \
    adduser -S docusaurus -G docusaurus && \
    npm install -g serve@14

COPY --from=builder --chown=docusaurus:docusaurus /app/build ./build

USER docusaurus

EXPOSE 3000

CMD ["serve", "-s", "build", "-l", "3000"]
