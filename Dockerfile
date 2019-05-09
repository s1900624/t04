FROM node:carbon

# Create app directory
WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install
RUN npm install forever -g

# Bundle app source
COPY . .

EXPOSE 80
CMD [ "npm", "start" ]