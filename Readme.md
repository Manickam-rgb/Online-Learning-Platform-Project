# Learn+ Dashboard Project

## Overview
Learn+ is an educational dashboard platform designed to manage user courses, special classes, schedules, and assignments. The application enables users to book special classes, view progress, and interact with a responsive UI. The project includes backend APIs for user authentication, booking management, and database integration.

## Features
 **User Authentication**: Secure login and registration using JWT tokens.
 **Special Class Booking**:
  - Book new classes with details like course, trainee, date, and slot.
  - Edit existing bookings with pre-filled details.
 **Responsive UI**: Interactive components such as popups and booking cards.

---

## Project Structure

### Frontend
 **HTML**: Main structure provided in `Home.html`.
 **CSS**: Styling handled by `Home.css`.
 **JavaScript**: Core logic and dynamic behavior implemented in `home.js`.

### Backend
 **Server**: API server built using Node.js and Express (`server.js`).
 **Database**: MySQL database for storing user and booking data.

---

## Installation

### Prerequisites
1. **Node.js**: Ensure Node.js is installed on your system.
2. **MySQL**: Set up a MySQL database and create the necessary schema.

### Steps
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd <project-directory>
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up MySQL database:
   - Create a database named `olp`.
   - Import the provided SQL schema file(OLP_Database.sql) (if available).
   - Update `server.js` with your database credentials:
     ```
     const db = mysql.createPool({
         host: 'localhost',
         user: 'root',
         password: '<your-password>',
         database: 'olp',
     });
     ```
4. Start the backend server:
   ```bash
   npm start or node server.js
   ```
5. Open `Home.html` in a browser to view the frontend.

---

## API Endpoints

### Authentication
- **POST** `/api/register`: Register a new user.
  - Body: `{ "username": "string", "email": "string", "password": "string" }`
- **POST** `/api/login`: Authenticate a user.
  - Body: `{ "username": "string", "password": "string" }`

### Bookings
- **GET** `/api/bookings`: Fetch all bookings for the logged-in user.
- **POST** `/api/book`: Create a new booking.
  - Body: `{ "course": "string", "trainee": "string", "date": "YYYY-MM-DD", "slot": "string" }`
- **GET** `/api/bookings/:id`: Fetch details of a specific booking.
- **PUT** `/api/bookings/:id`: Update an existing booking.
  - Body: `{ "course": "string", "trainee": "string", "date": "YYYY-MM-DD", "slot": "string" }`

---

## Usage

### Booking a Special Class
1. Click the **Book Now** button on the dashboard.
2. Fill in the course, trainee, date, and time slot.
3. Click **Save** to book the class.

### Editing a Booking
1. Click the **Edit** button on an existing booking card.
2. Update the details in the popup.
3. Click **Save** to update the booking.

---

## Troubleshooting

### Common Errors
- **500 Internal Server Error**:
  - Ensure the database is running and credentials in `server.js` are correct.
  - Check server logs for SQL or validation errors.
- **404 Not Found**:
  - Verify the API endpoint and parameters.

### Debugging
- Use browser DevTools for frontend issues.
- Use tools like Postman to test API endpoints.

---


