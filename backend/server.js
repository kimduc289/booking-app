const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory storage
let bookings = [];

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK' });
});

app.get('/api/bookings', (req, res) => {
  res.json(bookings);
});

app.post('/api/bookings', (req, res) => {
  const { name, email, date, time, guests } = req.body;
  
  if (!name || !email || !date || !time || !guests) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const booking = {
    id: uuidv4(),
    name,
    email,
    date,
    time,
    guests: parseInt(guests),
    createdAt: new Date()
  };

  bookings.push(booking);
  res.status(201).json(booking);
});

app.get('/api/bookings/:id', (req, res) => {
  const booking = bookings.find(b => b.id === req.params.id);
  if (!booking) {
    return res.status(404).json({ error: 'Booking not found' });
  }
  res.json(booking);
});

app.delete('/api/bookings/:id', (req, res) => {
  const index = bookings.findIndex(b => b.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Booking not found' });
  }
  bookings.splice(index, 1);
  res.json({ message: 'Booking deleted' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
