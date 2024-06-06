const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5001;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

app.use(cors({
    origin: '*',
    methods: 'GET,POST,DELETE',
    allowedHeaders: 'Content-Type'
}));

app.use(express.json());

app.get('/conversations', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM conversations');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch conversations' });
    }
});

app.post('/conversations', async (req, res) => {
    const { title } = req.body;
    try {
        const result = await pool.query('INSERT INTO conversations (title) VALUES ($1) RETURNING *', [title]);
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to create conversation' });
    }
});

app.get('/conversations/:id/messages', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM messages WHERE conversation_id = $1', [id]);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch messages' });
    }
});

app.delete('/conversations/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM conversations WHERE id = $1', [id]);
        res.status(204).end();
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to delete conversation' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
