# Task Management System

A full-stack Task Management System built with **React**, **TypeScript**, **Spring Boot**, and **H2 / PostgreSQL**. It supports **role-based access**, **JWT authentication**, and robust task handling features.

---

## Features

- Role-based access: Admin vs regular users
- Task creation, editing, deletion
- Assign tasks to users (Admin only)
- Task status (TODO, IN_PROGRESS, DONE)
- Priority levels (LOW, MEDIUM, HIGH)
- Due date support
- JWT authentication with auto logout on expiry
- Fully responsive UI with Material UI
- Unit + integration tests (backend)

---

## Folder Structure (Frontend)

- task-management-system/
  - backend/         # Spring Boot backend
    - src/           # Source code and tests
    - pom.xml        # Maven config
    - README.md      # Backend documentation

  - frontend/        # React frontend
    - src/           # Components, pages, services, types
    - package.json   # Dependencies and scripts
    - README.md      # Frontend documentation

  - README.md        # Main project overview

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/otienogeoffrey812/task-management-system
   ```
2. Navigate to the project directory:
   ```bash
   cd task-management-system
   ```

## Screenshots
![Task Management Dashboard](https://github.com/otienogeoffrey812/task-management-system/blob/main/tasks-management-dashboard.png)