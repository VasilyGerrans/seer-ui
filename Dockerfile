FROM node:22-alpine

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm run build

EXPOSE 3000

CMD sh -c 'echo -e "\033[34m[SEER]\033[0m Application is running at \033[32mhttp://localhost:3000\033[0m\n\033[34m[SEER]\033[0m Watching for new transactions in \033[33m./seer\033[0m" && pnpm start > /dev/null 2>&1'
