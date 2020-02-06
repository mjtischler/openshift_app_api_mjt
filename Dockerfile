FROM node:10 as builder

# Temporary working directory
WORKDIR /tmp

# Copy the local repo to the working directory
COPY . .

# Install app dependencies
RUN npm install && \
    npx babel-cli ./src --out-dir dist/ --ignore ./node_modules,./.babelrc,./package.json,./npm-debug.log --copy-files

FROM node:10

# Create app directory
WORKDIR /usr/src/app

# Copy the compiled assets to reduce image size
COPY --from=builder tmp/ .

# Set ENV variables
ENV SKIP_PREFLIGHT_CHECK=true \
    NODE_ENV=production

USER 9000
EXPOSE 8081
CMD npm run docker