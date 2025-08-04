# Task Management – Backend

## Overview

This Spring Boot backend provides RESTful APIs for managing tasks and users in a collaborative task management system. It supports user authentication, role-based authorization, and task CRUD operations. Admin users can assign tasks to users, delete tasks, and perform elevated actions.

## Technologies

- Java 17
- Spring Boot 3.5.4
- Spring Data JPA
- Spring Security + JWT
- H2 (or PostgreSQL)
- Lombok
- Bean Validation (Jakarta & Hibernate Validator)
- JUnit 5 + Mockito
- Swagger / OpenAPI

## Features

- **User Authentication**: Login with username and password using JWT  
- **Role-Based Access**: Only admins can create, assign, or delete tasks  
- **Task Management**: Authenticated users can view, update, and manage tasks  
- **Validation**: Input validation with informative error messages  
- **Exception Handling**: Global exception handling for common errors  
- **Secure API**: All routes protected via Spring Security  
- **Database Integration**: Uses H2 (can be switched to PostgreSQL)

# App Configuration

Ensure your `application.properties` contains the following:

- spring.application.name=task-management
server.port=3003

# H2 Database (Default for Dev/Test)
- spring.datasource.url=jdbc:h2:mem:task_management;DB_CLOSE_DELAY=-1
- spring.datasource.driver-class-name=org.h2.Driver
- spring.datasource.username=sa
- spring.datasource.password=sa
- spring.jpa.hibernate.ddl-auto=update

# JWT Configuration
app.jwt.secret=el1kGKVimqy5tSwUoSs2CNC2Cf8Tw2JO5BMxrFwy

- To use PostgreSQL instead, comment out the H2 section and uncomment the following:

# PostgreSQL Database Configuration
- #spring.datasource.url=jdbc:postgresql://localhost:5432/task_management
- #spring.datasource.username=postgres
- #spring.datasource.password=password
- #spring.datasource.driver-class-name=org.postgresql.Driver

# JPA & Hibernate
- #spring.jpa.hibernate.ddl-auto=update
- #spring.jpa.show-sql=true
- #spring.jpa.properties.hibernate.dialect=org.-hibernate.dialect.PostgreSQLDialect

## Running the App with Maven

Build the project

- mvn clean install

Run the application

- mvn spring-boot:run

The application will start on http://localhost:3003