FROM node:16.18.1-bullseye-slim AS base
WORKDIR /app

FROM base AS build
WORKDIR /app

# pnpm not found
#RUN curl -f https://get.pnpm.io/v6.14.js | node - add --global pnpm

RUN npm i -g pnpm@7.17
COPY pnpm-lock.yaml ./
COPY pnpm-workspace.yaml ./
COPY . ./
# https://github.com/pnpm/pnpm/issues/4378#issuecomment-1196475708
RUN pnpm -F remix --no-dev deploy /app/deploy
RUN cd /app/deploy && npm run build

# Finally, build the production image with minimal footprint
FROM base

WORKDIR /app

COPY --from=build /app/deploy/node_modules /app/node_modules

COPY --from=build /app/deploy/app /app/app
COPY --from=build /app/deploy/build /app/build
COPY --from=build /app/deploy/public /app/public
COPY --from=build /app/deploy/package.json /app/package.json
COPY --from=build /app/deploy/start.sh /app/start.sh

ENV PORT="8080"
ENV NODE_ENV="production"

EXPOSE 8080

ENTRYPOINT ["./start.sh"]
