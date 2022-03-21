
FROM node:14.15.1-alpine
ENV NODE_ENV=production

WORKDIR /app

COPY ["package.json", "package-lock.json*", "./"]
RUN npm ci

COPY . .

USER node
ENTRYPOINT [ "docker-entrypoint.sh" ]
CMD [ "node", "index.js" ]
