FROM node:22-alpine AS builder

RUN corepack enable \
 && corepack prepare pnpm@latest --activate

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm run build

FROM node:22-alpine AS runner

RUN corepack enable \
 && corepack prepare pnpm@latest --activate

RUN apk add --no-cache bash

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --prod

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

COPY wait-for-it.sh /wait-for-it.sh
RUN chmod +x /wait-for-it.sh

USER node
EXPOSE 3333

CMD ["/wait-for-it.sh", "rabbitmq:5672", "--", "node", "dist/server.js"]