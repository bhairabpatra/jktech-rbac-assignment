# Document Access Management with RBAC

This project implements a **Role-Based Access Control (RBAC)** system for secure document management using a **microservices architecture**.  
It ensures that users have access only to the actions permitted by their assigned role (Viewer, Editor, Admin).

---

## Microservices Overview

- **API Gateway** – Entry point for all client requests.
- **User Service** – Handles registration, login, authentication, role management, and encrypted password storage.
- **Document Service** – Manages document operations (view, edit, delete, download).
- **Ingestion Management Service** – Handles ingestion and processing of uploaded documents.
- **Role-Based Dashboard (UI)** – Provides different views and features based on user roles.

---

## Authentication & Security

- **User Registration & Login** – Customers can register and log in with email/password credentials.
- **Logout Support** – Users can securely log out from the system.
- **Password Security** – Passwords are stored using **SHA-256 encryption** (HMAC / salted hashing for security).
- **JWT Authentication** – Users receive a **JWT token** upon login, which includes:
  - `id` (user ID)
  - `name` (user name)
  - `email` (user email)
  - `sub` (subject identifier)
  - `exp` (token expiry time)

---

##  Roles & Permissions

### Viewer

-  Can **view** all documents (read-only).
-  Cannot edit, delete, or download.

### Editor

- Can **view** all documents.
- Can **edit** documents uploaded by them.
- Cannot delete or download.

### Admin

- Full access to **all documents and users**.
- Can **view, edit, delete, and download** any document.
- Can **manage users**: assign/change roles (Viewer, Editor, Admin).
- Can delete or edit any user’s uploaded document.

---

##  Tech Stack

- **NestJS** – Microservice framework
- **TypeORM + MySQL** – Database layer (Since this assignment was developed on my office laptop, I was unable to install MongoDB or PostgreSQL. Therefore, I chose to use MySQL as the database for implementation.)
- **JWT Authentication** – Secure login with tokens
- **SHA-256 Encryption** – Secure password storage
- **Docker / Docker Compose** – Containerization
- **Swagger / Postman** – API documentation & testing

---

# Ingestion Management Service

The **Ingestion Management Service** is responsible for handling document ingestion workflows.  
When a user uploads a document, this service verifies the upload, stores the ingestion status in the database,  
and updates the status after processing.

---

## How It Works

1. **Document Upload**

   - When a user uploads a document, the service creates a new entry in the database.
   - The initial status is set to:
     ```
     ingestion_start
     ```

2. **Processing Simulation**

   - After **3000ms (3 seconds)**, the service automatically updates the document status.
   - Status flow:
     - `ingestion_complete` → if processing is successful
     - `failed` → if processing fails

   ## API Endpoints

The service provides a set of APIs for document ingestion.  
All APIs are documented using **Swagger UI** for easy testing and reference.

## Setup & Run

```bash
# Clone the repository
git clone <your-repo-url>
cd <project-folder>

# Install dependencies (example: user-service)
cd user-service
npm install

# Run services
npm run start:dev

# Recmonded
Run docker desktop in system
docker pull mysql
docker run --name mysql -e MYSQL_ROOT_PASSWORD=rootpass -e MYSQL_DATABASE=mydb -d -p 3306:3306 mysql:8.0
docker run --name phpmyadmin --link mysql:db -d -e PMA_HOST=mysql -e MYSQL_ROOT_PASSWORD=rootpass -p 8080:80 phpmyadmin/phpmyadmin
Username: root   Password: rootpass

# Install dependencies (example: user-service)
cd user-service all service and UI app
npm install

# Run services
npm run start:dev


docker-compose -f docker-compose.yml up --build
docker-compose down

```

