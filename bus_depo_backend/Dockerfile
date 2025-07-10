# Use official Java image with Maven
FROM maven:3.9.4-eclipse-temurin-21

# Set working dir inside container
WORKDIR /app

# Copy pom.xml and download dependencies
COPY ./pom.xml .
RUN mvn dependency:go-offline

# Copy rest of the project
COPY . .

# Package the app
RUN mvn clean package -DskipTests

# Run the app
CMD ["java", "-jar", "target/bus_depo_backend-0.0.1-SNAPSHOT.jar"]
