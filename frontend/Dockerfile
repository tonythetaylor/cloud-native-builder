FROM node:18-alpine

WORKDIR /app

# install dependencies first (leveraging Docker cache)
COPY package.json package-lock.json ./
RUN npm ci

# copy rest of your source
COPY . .

# expose Vite’s default port
EXPOSE 3000

# start the dev server
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]