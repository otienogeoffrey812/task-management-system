# Task Management - Frontend

## Overview

This project provides a user-friendly dashboard for managing tasks. It allows users to log in, view tasks, assign them, change their status, and manage priorities using a responsive UI. Admin users have elevated permissions such as creating tasks, assigning users and deleting tasks.

## Technologies
- React 19
- TypeScript
- Material UI
- React Router DOM v6
- React Hook Form
- Axios

## Features

- **Authentication**: Users can log in with credentials; JWT stored securely
- **Role-based Access**: Admins can assign tasks and delete them; users can update their own tasks
- **Task Dashboard**: Displays all tasks with filtering
- **Task Modal**: Add, update, and view tasks in a modal dialog
- **User Assignment**: Admins can assign tasks to other users
- **Responsive UI**: Optimized for mobile and desktop screens
- **Error Handling**: Displays alerts for login or API errors

## Environment Variables

Create a `.env` file in the root of the `/frontend` folder with the following content:
- REACT_APP_BACKEND_URL=http://localhost:3003/api

## Executing Program

- To start the frontend, navigate to /frontend and run `npm install` then `npm start`.
