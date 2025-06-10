FROM node:16

WORKDIR /app

COPY package*.json /app/

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

COPY . /app/

RUN npm run server-build

ENV NODE_ENV=production

CMD npm start --bind 0.0.0.0:$PORT