FROM node:16

WORKDIR /doorfront

COPY package*.json /doorfront/

RUN npm ci
# If you are building your code for production
# RUN npm ci --only=production

COPY . /doorfront/

RUN cd /doorfront/app

RUN npm ci

RUN cd ..

# Development Mode
# -----------------------------------------------------------------------------
# Uncomment the following statement(s) if you run on development mode
# ENV NODE_ENV=development

# EXPOSE 3000

# EXPOSE 27017

# EXPOSE 8080

# CMD npm run dev

# Production Mode
# -----------------------------------------------------------------------------
# Uncomment the following statement(s) if you run on production mode

RUN npm run linux-build

ENV NODE_ENV=production

CMD npm start --bind 0.0.0.0:$PORT