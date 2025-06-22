const express = require('express');
const cors = require('cors');
const path = require('path');
const mysql = require('mysql2');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
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

// ✅ Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// API route
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

// Fallback route
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
