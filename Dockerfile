
FROM node:14.15.1
ENV NODE_ENV=production

WORKDIR /app

COPY ["package.json", "package-lock.json*", "./"]
RUN npm ci

COPY . .

USER node
ENTRYPOINT [ "node" ]
CMD [ "index.js" ]
