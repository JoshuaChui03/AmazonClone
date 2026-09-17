# Amazon Clone

A full-stack Amazon-style e-commerce web application built with JavaScript, Node.js, Express, MongoDB, and Mongoose.

## Features
- Browse and search products
- Add, remove, and update cart items
- Select delivery options
- Place orders
- View order history
- Track order progress
- Temporary guest sessions
- Persistent demo user account
- JWT authentication using HttpOnly cookies

## Tech Stack

### Frontend

HTML
CSS
JavaScript
Jasmine

### Backend

Node.js
Express
MongoDB
Mongoose
JWT
bcrypt

## Project Structure
### frontend/
HTML, CSS, JavaScript, and tests

### backend/
Express API, authentication, models, and database logic

### Running Locally

1. Install the backend dependencies:

   - `cd backend`
   - `npm install`

2. Create a `.env` file from [`backend/.env.example`](backend/.env.example), fill in the required values, then run:

   - `npm run dev`

3. Run the frontend using a local web server.

### Demo Account

The application includes a persistent demo user so visitors can view saved cart data, orders, and order tracking.

- Username: __demo__
- Password: __demo__

Guest users can also use the application through temporary guest sessions.

### Deployment
Frontend: GitHub Pages
Backend: Heroku
Database: MongoDB Atlas
### Live Site

https://joshuachui.net