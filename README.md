# Asset Management System

A comprehensive system for managing organizational assets, featuring a Spring Boot backend and a React frontend.

## 📁 Project Structure

The project is divided into two main components:

- **[Backend (Spring Boot)](./assetManagement-be)**: Handles data management, business logic, and security.
- **[Frontend (React + Vite)](./assetManagement-fe)**: Provides the user interface for managing assets, brands, and users.

---

## ⚡ Quick Start

Follow these steps to get the entire system up and running on your local machine.

### 1. Backend Setup
1.  Navigate to `assetManagement-be/`.
2.  Create a MySQL database named `asset_management`.
3.  Configure `src/main/resources/application.properties` with your database credentials.
4.  Run the application:
    ```bash
    ./mvnw spring-boot:run
    ```

### 2. Frontend Setup
1.  Navigate to `assetManagement-fe/`.
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Ensure `.env` is configured (defaults to `http://localhost:8080/asset-management`).
4.  Start the development server:
    ```bash
    npm run dev
    ```

---

## 🛠️ Key Features
- **Asset Lifecycle Management**: Track devices from acquisition to retirement.
- **Role-Based Access Control**: Secure access for Admins, Managers, and Staff.
- **Brand Management**: Manage device brands and categories.
- **Assignment Tracking**: Keep track of which user is assigned to which device.

## 📚 Detailed Documentation
For more specific details, please refer to the individual README files in each directory:
- [Backend Documentation](./assetManagement-be/README.md)
- [Frontend Documentation](./assetManagement-fe/README.md)
