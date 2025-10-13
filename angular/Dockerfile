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

EXPOSE 4200

CMD ["yarn", "start", "--host", "0.0.0.0", "--poll", "2000"]

