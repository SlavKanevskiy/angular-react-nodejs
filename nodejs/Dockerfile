FROM node:22-alpine

# Enable Corepack for Yarn
RUN corepack enable && corepack prepare yarn@4.10.3 --activate

WORKDIR /app

# Copy package files
COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn ./.yarn

# Install dependencies
RUN yarn install --immutable

# Copy application code
COPY . .

# Generate Prisma Client
RUN yarn prisma generate

EXPOSE 3000

CMD ["yarn", "start"]

