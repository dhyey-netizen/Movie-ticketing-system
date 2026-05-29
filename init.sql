CREATE DATABASE IF NOT EXISTS movie_ticketing;

USE movie_ticketing;

CREATE TABLE IF NOT EXISTS movies (
    id INT AUTO_INCREMENT PRIMARY KEY, 
    title VARCHAR(255), description TEXT, 
    poster_url VARCHAR(500), 
    genre VARCHAR(100), 
    release_date DATE, 
    duration INT, 
    rating FLOAT, 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY, 
    name VARCHAR(255), 
    email VARCHAR(255), 
    password VARCHAR(255), 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS booking (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    movie_id INT,
    booking_date DATE,
    quantity INT,
    total_price DECIMAL
);

CREATE TABLE IF NOT EXISTS booked_seats (
    id INT AUTO_INCREMENT PRIMARY KEY,
    movie_id INT NOT NULL,
    seat_code VARCHAR(10) NOT NULL,
    booking_date DATE NOT NULL,
    user_id INT
);