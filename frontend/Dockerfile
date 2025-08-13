# Stage 1: Build the application
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json ./
RUN npm install

COPY . .
#RUN npm run build
# Or tsc

# Stage 2: Run the application
FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
# Or wherever your compiled JS is located

EXPOSE 3006
# Replace with your application's port

CMD ["node", "dist/index.js"]
# Replace with your main compiled JS file

#########
## pull official base image
#FROM node:latest as build
## set working directory
#WORKDIR /app
## add `/app/node_modules/.bin` to $PATH
#ENV PATH /app/node_modules/.bin:$PATH
## install app dependencies
#COPY package.json ./
#COPY package-lock.json ./
## Silent clean install of npm
#RUN npm ci --silent
#RUN npm install react-scripts@3.4.1 -g --silent
## add app
#COPY . /app/
#
## Build production
#RUN npm run build
#RUN npm install -g serve
#
### Start the app on port 3006
#CMD serve -s build -l 3006