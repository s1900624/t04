FROM node:carbon

# Install software 
RUN apt-get install -y git
RUN npm install forever -g
VOLUME /reaktiopeli

RUN git clone https://github.com/s1900624/t04.git /reaktiopeli/

# Create app directory
WORKDIR /reaktiopeli

EXPOSE 80
CMD git pull origin master && npm install -y && npm start