# Build of React
FROM node:14.17.0-alpine@sha256:b4cca2f95c701d632ffd39258f9ec9ee9fb13c8cc207f1da02eb990c98395ac1

RUN apk add --no-cache git

# Create working directory
RUN mkdir -p /usr/src/app/node_modules  && chown -R node:node /usr/src/app
WORKDIR /usr/src/app

# Timezone
ENV TZ=America/Bogota

# Copy package json for use cache efficiently
COPY package*.json ./

# User
USER node

# Install app dependencies
RUN npm install

# Copying required files from your file system to container file system
COPY --chown=node:node . .

# Install client and build
RUN npm run build:install

# Expose the port
EXPOSE 3001

# Command to run when intantiate an image
CMD ["npm","start"]