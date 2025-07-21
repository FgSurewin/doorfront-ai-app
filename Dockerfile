FROM node:16

WORKDIR /doorfront

# Copy root package files and install
COPY package*.json ./
RUN npm ci

# Copy frontend package files and install
COPY app/package*.json ./app/
RUN npm ci --prefix ./app

# Copy everything else
COPY . .

# Build both app and server
RUN npm run build --prefix ./app && npm run server-build

ENV NODE_ENV=production
ENV PORT=8080

EXPOSE 8080

CMD ["npm", "start"]
