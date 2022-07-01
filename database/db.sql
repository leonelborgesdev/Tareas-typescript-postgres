CREATE TABLE IF NOT EXISTS tasks(
    id SERIAL PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description varchar(200),
    create_on TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
)

INSERT INTO tasks (title, description) VALUES ('Task 1', 'Description 1')