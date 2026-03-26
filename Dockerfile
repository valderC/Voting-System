FROM eclipse-temurin:21-jdk AS backend-build
RUN apt-get update && apt-get install -y --no-install-recommends unzip && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY pom.xml mvnw ./
COPY .mvn .mvn
RUN chmod +x mvnw && ./mvnw dependency:go-offline -B
COPY src src
RUN ./mvnw package -DskipTests -B

FROM node:20-alpine AS frontend-build
WORKDIR /app
COPY voting-ui/package.json voting-ui/package-lock.json ./
RUN npm ci
COPY voting-ui/ .
RUN npx ng build --configuration production

FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=backend-build /app/target/*.jar app.jar
COPY --from=frontend-build /app/dist/voting-ui/browser /app/static

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar", "--spring.web.resources.static-locations=file:/app/static/"]
