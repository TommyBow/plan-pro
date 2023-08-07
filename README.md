# Plan Pro - Full Stack MERN To-Do App

Welcome to Plan Pro, a To-Do application built using the MERN stack (MongoDB, Express, React, Node.js). Plan Pro allows users to manage their tasks efficiently and provides additional features for both regular users and administrators.

## Introduction

Plan Pro is a powerful To-Do application designed to help users organize their tasks effectively. It offers a user-friendly interface and features for adding, editing, and deleting tasks. Additionally, administrators have access to user management and note editing capabilities.

## Features

### User Features

- User Registration and Login (with email, Google, Facebook)
- Add tasks with the following details:
  - Date
  - Title
  - Description
- Edit and delete tasks
- Logout functionality

### Admin Features

- Admin Registration and Login
- View registered users
- User management (edit and delete user accounts)

## Technologies Used

- **Frontend:** React, Redux, HTML, CSS
- **Backend:** Node.js, Express.js, Passport.js (authentication)
- **Database:** MongoDB
- **Deployment:** Heroku (example)

## Getting Started

Before you begin, make sure you have Node.js and MongoDB installed.

## Installation

1. Clone this repository: `git clone https://github.com/TommyBow/plan-pro.git`
2. Navigate to the project directory: `cd plan-pro`
3. Install dependencies: `npm install`

## Usage

1. Start the development server: `npm start`
2. Open your browser and visit: `http://localhost:3000`

## API Endpoints

- `/api/auth`: Authentication endpoints
- `/api/users`: User management endpoints
- `/api/tasks`: Task-related endpoints

## Configuration

1. Rename `.env.example` to `.env` in the root directory.
2. Update the `.env` file with your MongoDB URI and other configuration settings.
3. For third-party APIs (such as Google or Facebook login), update the respective API keys and secrets in the `.env` file.

## Security Measures

We take the security of this application seriously. Here are some measures we've implemented:

- Passwords are securely hashed before being stored in the database.
- User authentication is handled using JWT (JSON Web Tokens).
- Sensitive information (such as API keys) is stored in environment variables to prevent exposure.

## Third-Party APIs

We have integrated the following third-party APIs:

- Google Login API for user authentication
- Facebook Login API for user authentication


## Frontend

The frontend of this app is built using React and Redux to provide a smooth and interactive user experience.

## Backend

The backend is powered by Node.js and Express.js, with Passport.js for authentication and MongoDB for data storage.

## Contributing

Contributions are always welcome! Please fork this repository and create a pull request with your proposed changes.

---

Thank you for choosing Plan Pro for your task management needs. We hope you find the application helpful and efficient in managing your tasks. If you encounter any issues or have suggestions for improvements, please feel free to reach out
