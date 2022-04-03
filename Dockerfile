
FROM node:16.13.1-alpine
ENV NODE_ENV=production

WORKDIR /app

COPY ["package.json", "package-lock.json*", "./"]
RUN npm ci --omit=dev --ignore-scripts

COPY . .

USER node
ENTRYPOINT [ "docker-entrypoint.sh" ]
CMD [ "node", "index.js" ]
