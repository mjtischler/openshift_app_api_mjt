FROM node:10

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./server/
RUN npm install

# Bundle app source
COPY . .

EXPOSE 8081
CMD npm start