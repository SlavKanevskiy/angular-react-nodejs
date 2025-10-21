# Base stage with common setup
FROM node:22-alpine AS base
RUN corepack enable

# Build Angular
FROM base AS angular-build
WORKDIR /app
COPY angular/.yarnrc.yml ./
COPY angular/package.json angular/yarn.lock ./
RUN --mount=type=cache,target=/root/.yarn \
    yarn install
COPY shared/ ../shared/
COPY angular/ ./
ENV API_URL=""
ENV NODE_ENV=production
RUN yarn build --configuration=production

# Build React
FROM base AS react-build
WORKDIR /app
COPY react/.yarnrc.yml ./
COPY react/package.json react/yarn.lock ./
RUN --mount=type=cache,target=/root/.yarn \
    yarn install
COPY shared/ ../shared/
COPY react/ ./
ENV API_URL=""
ENV NODE_ENV=production
RUN yarn build

# Final nginx stage
FROM nginx:alpine

# Copy static files from builds
COPY --from=angular-build /app/dist/angular/browser /usr/share/nginx/html/angular/
COPY --from=react-build /app/dist /usr/share/nginx/html/react/

# Copy shell files
COPY shell/index.html /usr/share/nginx/html/
COPY shell/nginx.conf /etc/nginx/conf.d/

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]