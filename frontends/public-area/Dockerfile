# Stage 1 - the build process
FROM node:18 as build-deps
ENV BUILD_ENV production
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . ./
RUN npm run build

# Stage 2 - the production environment
FROM node:18
ENV BUILD_ENV production
WORKDIR /usr/src/app
COPY --from=build-deps /usr/src/app/.next ./.next
COPY --from=build-deps /usr/src/app/node_modules ./node_modules
COPY --from=build-deps /usr/src/app/public ./public
COPY --from=build-deps /usr/src/app/package.json ./package.json
COPY --from=build-deps /usr/src/app/next.config.js ./next.config.js
EXPOSE 3000
CMD ["npm", "start"]
