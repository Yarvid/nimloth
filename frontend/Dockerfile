# Pull base image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# Copy package.json and package-lock.json to the working directory
COPY package.json /app/package.json
COPY package-lock.json /app/package-lock.json

# Install app dependencies
RUN npm install
RUN npm install -g @angular/cli@11.0.7

# Copy app source to the working directory
COPY . /app

# Start the app
CMD ng serve --host 0.0.0.0 --port 4200
