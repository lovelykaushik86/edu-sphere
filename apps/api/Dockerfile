FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
COPY apps/api/package.json apps/api/package.json
COPY apps/web/package.json apps/web/package.json
RUN npm ci
COPY apps/api apps/api
RUN npm run prisma:generate -w @edusphere/api
RUN npx tsc apps/api/prisma/seed.ts --skipLibCheck --module commonjs --target es2020 --outDir apps/api/prisma/dist
RUN npm run build -w @edusphere/api

FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
COPY apps/api/package.json apps/api/package.json
RUN npm ci --omit=dev
COPY --from=build /app/apps/api/dist apps/api/dist
COPY --from=build /app/apps/api/prisma apps/api/prisma
COPY --from=build /app/node_modules/.prisma node_modules/.prisma
EXPOSE 3000
CMD ["sh", "-c", "npx prisma db push --schema apps/api/prisma/schema.prisma --accept-data-loss && node apps/api/prisma/dist/seed.js || true && node apps/api/dist/main"]
