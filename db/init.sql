CREATE TABLE IF NOT EXISTS conversations (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS messages (
    id SERIAL PRIMARY KEY,
    conversation_id INTEGER REFERENCES conversations (id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    sender VARCHAR(50) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);