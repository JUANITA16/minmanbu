# build environment
FROM atools/jdk-maven-node:mvn3-jdk11-node16 as build
 
WORKDIR /app

COPY package*.json ./

RUN npm install --silent

COPY . ./
RUN npm run build
COPY /app/build/ /app/proxy/src/main/resources/static
RUN mvn clean install

# production environment
FROM atools/jdk-maven-node:mvn3-jdk11-node16

RUN mkdir -p /proxy_app/jar/
COPY /proxy/target/proxy-0.0.1-SNAPSHOT.jar /proxy_app/jar

#Expose port
EXPOSE 80

CMD ["java", "-jar", "/proxy_app/jar/proxy-0.0.1-SNAPSHOT.jar"] 