CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    wins INT DEFAULT 0,
    level INT DEFAULT 1,
    coins INT DEFAULT 0
);
