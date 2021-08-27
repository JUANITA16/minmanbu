# pull official base image
FROM node:15.4 as build

# set working directory
WORKDIR /app

# Copy and build
COPY package*.json ./

# add app
COPY . ./
RUN npm run build

FROM nginx:1.19

COPY ./nginx/nginx.conf /etc/nginx/nginx.conf
COPY --from=build /app/build /usr/share/nginx/html

# Install all dependencies
RUN npm install

# Expose the port
EXPOSE 3000

# Command to run when intantiate an image
CMD ["npm","start"]