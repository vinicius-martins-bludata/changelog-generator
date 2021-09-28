FROM node:16-alpine
WORKDIR /app
COPY ["package.json", "./"]
RUN yarn install
COPY . .
RUN ls node_modules
ENTRYPOINT ["yarn", "start"]