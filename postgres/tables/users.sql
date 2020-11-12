BEGIN TRANSACTION;
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    email text unique NOT NULL,
    entries BIGINT DEFAULT 0,
    pet VARCHAR(100),
    age INT,
    joined TIMESTAMP NOT NULL
);
COMMIT;