-- DecodeLabs Project 3: Database Schema
-- Run this in your PostgreSQL database to create the tables

-- Create the Users Table (Parent)
CREATE TABLE Users (
    UserID SERIAL PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    Email VARCHAR(100) UNIQUE NOT NULL
);

-- Create the Orders Table (Child)
CREATE TABLE Orders (
    OrderID SERIAL PRIMARY KEY,
    Total DECIMAL(10, 2) NOT NULL,
    UserID INT,
    FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE CASCADE
);