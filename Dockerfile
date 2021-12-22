# build environment
FROM atools/jdk-maven-node:mvn3-jdk11-node16 as build
 
WORKDIR /app

COPY package*.json ./

RUN npm install --silent

COPY . ./
RUN npm run build; \
    cp ./build/build/ ./proxy/src/main/resources/static/; \
    mvn -f ./proxy/pom.xml clean install; \
    cd proxy/src/main/resources/static/; \
    ls ;

# production environment
FROM atools/jdk-maven-node:mvn3-jdk11-node16

RUN mkdir -p /proxy_app/jar/
COPY --from=build /app/proxy/target/proxy-0.0.1-SNAPSHOT.jar /proxy_app/jar

#Expose port
EXPOSE 80

CMD ["java", "-jar", "/proxy_app/jar/proxy-0.0.1-SNAPSHOT.jar"] 