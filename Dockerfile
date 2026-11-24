FROM node:22-alpine AS build
WORKDIR /workspace
COPY package.json package-lock.json ./
RUN npm ci
COPY tsconfig.json nest-cli.json ./
COPY scripts/build.mjs ./scripts/build.mjs
COPY apps ./apps
RUN npm run build

FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force
COPY --from=build /workspace/dist ./dist
USER node
EXPOSE 3000
CMD ["sh", "-c", "exec node dist/apps/${SERVICE_NAME}/main.js"]
