FROM node:20-alpine AS deps
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci --omit=dev

FROM node:20-alpine AS runner
ENV NODE_ENV=production
WORKDIR /usr/src/app
RUN apk add --no-cache curl
COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY . .
EXPOSE 4173
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s CMD curl -f http://127.0.0.1:4173/ || exit 1
CMD ["node", "server.js"]

