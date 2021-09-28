FROM node:14-alpine3.11
WORKDIR /app
COPY . .
CMD ["yarn", "start"]