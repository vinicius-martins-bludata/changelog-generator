FROM node:16-alpine
COPY ["src/index.js", "src/changelog.js", "package.json", "yarn.lock", "/github/app/"]
COPY entrypoint.sh /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]