# Asset Management System - Frontend

This is the React + Vite frontend for the Asset Management System.

## 🚀 Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/) (usually comes with Node.js)

## ⚙️ Configuration

The frontend requires environment variables to connect to the backend API.

1. **Create .env File**:
   In the root of the `assetManagement-fe` directory, ensure you have a `.env` file. You can use the following template:

   ```env
   VITE_API_BASE_URL=http://localhost:8080/asset-management
   VITE_API_VERSION=v1
   VITE_AUTH_USER_PATH=/auth/user
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

## 🏃 How to Run

### Development Mode
Runs the app in development mode with Hot Module Replacement (HMR).
```bash
npm run dev
```
By default, the app will be available at `http://localhost:5173`.

### Production Build
Builds the app for production to the `dist` folder.
```bash
npm run build
```

### Preview Production Build
Locally preview the production build.
```bash
npm run preview
```

## 📚 Resources

- [Live Demo (Dummy Link)](https://asset-management-demo.example.com)
- [UI Components (Dummy Link)](https://asset-management-design.example.com)
- [Project Documentation (Dummy Link)](https://asset-management-docs.example.com)

## 🛠️ Tech Stack
- **Framework**: React 19
- **Build Tool**: Vite 8
- **Styling**: Tailwind CSS 4
- **Icons**: Lucide React
- **Routing**: React Router 7
- **HTTP Client**: Axios
