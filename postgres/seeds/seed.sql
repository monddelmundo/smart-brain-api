BEGIN TRANSACTION;
INSERT INTO users (name, email, entries, pet, age, joined)
VALUES ('Mond', 'a@gmail.com', 3, 'dog', 25, '2020-11-01');
INSERT INTO login (hash, email)
VALUES (
        '$2a$10$Tz90wqIbfZDMA05rCiq/QuvY91.DuLzuFIbixbG0JQY3NrQFu8naK',
        'a@gmail.com'
    );
COMMIT;