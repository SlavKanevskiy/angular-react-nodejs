FROM node:22-alpine

RUN corepack enable && corepack prepare yarn@4.10.3 --activate

WORKDIR /app

COPY package.json yarn.lock .yarnrc.yml ./

RUN yarn install --immutable

COPY . .

RUN yarn prisma generate --schema ./database/schema.prisma

EXPOSE 3000

CMD ["yarn", "start:prod"]
