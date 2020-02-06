FROM node:10

# Create app directory
WORKDIR /usr/src/app

# Bundle app source
COPY . .

# Set ENV variables
ENV SKIP_PREFLIGHT_CHECK=true
ENV NODE_ENV=production

# Install app dependencies
RUN npm install
RUN npx babel-cli ./src --out-dir dist/ --ignore ./node_modules,./.babelrc,./package.json,./npm-debug.log --copy-files

USER 9000
EXPOSE 8081
CMD npm run docker