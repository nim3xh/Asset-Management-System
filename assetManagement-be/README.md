# Asset Management System - Backend

This is the Spring Boot backend for the Asset Management System.

## 🚀 Prerequisites

Before you begin, ensure you have the following installed:
- [Java 17](https://www.oracle.com/java/technologies/downloads/) or higher
- [MySQL Server](https://dev.mysql.com/downloads/mysql/)
- [Maven](https://maven.apache.org/download.cgi) (optional, wrapper included)

## ⚙️ Configuration

To run this application, you need to set up the database and application properties.

1. **Create the Database**:
   Create a database named `asset_management` in your MySQL server.
   ```sql
   CREATE DATABASE asset_management;
   ```

2. **Configure Properties**:
   Navigate to `src/main/resources/` and ensure `application.properties` is configured correctly. You can use the following template:

   ```properties
   spring.application.name=assetManagement

   # Database configuration
   spring.datasource.url=jdbc:mysql://localhost:3306/asset_management
   spring.datasource.username=YOUR_USERNAME
   spring.datasource.password=YOUR_PASSWORD
   spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

   # JPA/Hibernate configuration
   spring.jpa.hibernate.ddl-auto=update
   spring.jpa.show-sql=true

   # JWT configuration
   jwt.secret=your_super_secret_key_at_least_32_characters_long

   # Version & CORS
   version=v1
   app.cors.allowed-origins=http://localhost:5173
   ```

## 🏃 How to Run

You can run the application using the Maven wrapper included in the project.

### Using Command Line
```bash
# Windows
./mvnw.cmd spring-boot:run

# Linux/macOS
./mvnw spring-boot:run
```

### Using IDE
- Open the project in IntelliJ IDEA or Eclipse.
- Locate `AssetManagementApplication.java`.
- Right-click and select **Run**.

## 📚 API Documentation

Once the application is running, you can access the API documentation at:
- [Swagger UI (Dummy Link)](http://localhost:8080/asset-management/swagger-ui.html)
- [API Docs (Dummy Link)](http://localhost:8080/asset-management/v3/api-docs)

## 🛠️ Tech Stack
- **Framework**: Spring Boot 3
- **Security**: Spring Security, JWT
- **Database**: MySQL, Spring Data JPA
- **Build Tool**: Maven
