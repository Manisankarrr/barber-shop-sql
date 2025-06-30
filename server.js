const express = require('express');
const cors = require('cors');
const path = require('path');
const mysql = require('mysql2');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Allow CORS from anywhere or specific origin
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));

app.use(express.json());

// ✅ MySQL connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.error('❌ MySQL connection error:', err);
  } else {
    console.log('✅ MySQL connected to AWS RDS');
  }
});

// ✅ Health check route for ALB
app.get('/', (req, res) => {
  res.send('🟢 Server is healthy!');
});

// ✅ API route to handle booking
app.post('/api/book', (req, res) => {
  const { name, phone, email, date, time, branch, people, message } = req.body;

  const sql = `
    INSERT INTO bookings (name, phone, email, date, time, branch, people, message)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [name, phone, email, date, time, branch, people, message],
    (err, result) => {
      if (err) {
        console.error('❌ Booking error:', err);
        res.status(500).json({ error: 'Booking failed' });
      } else {
        res.status(201).json({ message: 'Booking saved' });
      }
    }
  );
});

// ✅ Serve static files from /public
app.use(express.static(path.join(__dirname, 'public')));

// ✅ Fallback for frontend routing (if needed)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ✅ ECS-compatible binding
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
});
