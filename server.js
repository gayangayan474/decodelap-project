require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Configure the Database Bridge using Environment Variables
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

pool.connect()
    .then(() => console.log('Connected to the Digital Vault successfully.'))
    .catch(err => console.error('Bridge connection failed:', err));

// --- CRUD OPERATIONS ---

// CREATE: Add a new User
app.post('/api/users', async (req, res) => {
    try {
        const { name, email } = req.body;
        const newUser = await pool.query(
            'INSERT INTO Users (Name, Email) VALUES ($1, $2) RETURNING *',
            [name, email]
        );
        res.status(201).json(newUser.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// READ: Retrieve all Users and their Orders
app.get('/api/users', async (req, res) => {
    try {
        const allUsers = await pool.query(`
            SELECT Users.UserID, Users.Name, Orders.OrderID, Orders.Total 
            FROM Users 
            LEFT JOIN Orders ON Users.UserID = Orders.UserID
        `);
        res.json(allUsers.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// UPDATE: Update a User's email
app.put('/api/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { email } = req.body;
        const updatedUser = await pool.query(
            'UPDATE Users SET Email = $1 WHERE UserID = $2 RETURNING *',
            [email, id]
        );
        res.json(updatedUser.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE: Remove an Order
app.delete('/api/orders/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM Orders WHERE OrderID = $1', [id]);
        res.json({ message: 'Order successfully deleted.' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});