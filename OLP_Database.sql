CREATE DATABASE OLP;
USE OLP;
CREATE TABLE bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    course VARCHAR(255),
    trainee VARCHAR(255),
    booking_date DATE,
    slot_time VARCHAR(255),
    FOREIGN KEY (user_id) REFERENCES users(id)
);
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);
select * from bookings;
select * from users




