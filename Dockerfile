FROM node:16-alpine
WORKDIR /app
COPY ["package.json", "./"]
RUN npm i
COPY . .
RUN ls node_modules
ENTRYPOINT ["npm", "start"]