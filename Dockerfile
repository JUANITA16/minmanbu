# build environment
FROM node:15.4 as build

RUN mkdir /usr/src/app
WORKDIR /usr/src/app

ENV PATH /usr/src/app/node_modules/.bin:$PATH
COPY package.json /usr/src/app/package.json

RUN npm install --silent
RUN npm install react-scripts@3.4.1 -g — silent

COPY . /usr/src/app
RUN npm run build

# production environment
FROM nginx:stable-alpine
COPY --from=builder /usr/src/app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"] 