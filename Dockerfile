# build environment
FROM node:15.4 as build

WORKDIR /app

COPY package*.json ./

RUN npm install --silent

COPY . ./
RUN npm run build

# production environment
FROM nginx:1.19

COPY ./nginx/nginx.conf /etc/nginx/nginx.conf
COPY --from=builder /app/build /usr/share/nginx/html

#Expose port
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"] 