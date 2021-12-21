# build environment
FROM ayan4m1/maven-node as build

WORKDIR /app

COPY package*.json ./

RUN npm install --silent

COPY . ./
RUN npm run build
COPY /app/build /app/proxy/src/main/resources/static
RUN mvn clean install

# production environment
FROM ayan4m1/maven-node

RUN mkdir -p /proxy/jar/
COPY --from=build /app/target/proxy-0.0.1-SNAPSHOT.jar /proxy/jar

#Expose port
EXPOSE 80

CMD ["java", "-jar", "/proxy/jar/proxy-0.0.1-SNAPSHOT.jar"] 