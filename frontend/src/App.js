import React, { useState, useEffect } from 'react';

function App() {
  const [bookings, setBookings] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    date: '',
    time: '',
    guests: ''
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  // Fetch bookings on component mount
  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await fetch(`${API_URL}/bookings`);
      const data = await response.json();
      setBookings(data);
    } catch (err) {
      console.error('Error fetching bookings:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    try {
      const response = await fetch(`${API_URL}/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Failed to create booking');
      }

      const newBooking = await response.json();
      setBookings(prev => [...prev, newBooking]);
      setFormData({
        name: '',
        email: '',
        date: '',
        time: '',
        guests: ''
      });
      setMessage('Booking created successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError('Error creating booking: ' + err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${API_URL}/bookings/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Failed to delete booking');
      }

      setBookings(prev => prev.filter(b => b.id !== id));
      setMessage('Booking deleted successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError('Error deleting booking: ' + err.message);
    }
  };

  return (
    <div className="container">
      <h1>🎯 Booking App</h1>
      {message && <div className="success">{message}</div>}
      {error && <div className="error">{error}</div>}
      
      <div className="content">
        <div className="form-section">
          <h2>Create a Booking</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
            <input
              type="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              required
            />
            <input
              type="number"
              name="guests"
              placeholder="Number of Guests"
              value={formData.guests}
              onChange={handleChange}
              min="1"
              required
            />
            <button type="submit">Book Now</button>
          </form>
        </div>

        <div className="bookings-section">
          <h2>Your Bookings ({bookings.length})</h2>
          {bookings.length === 0 ? (
            <p>No bookings yet. Create one to get started!</p>
          ) : (
            bookings.map(booking => (
              <div key={booking.id} className="booking-item">
                <h3>{booking.name}</h3>
                <p><strong>Email:</strong> {booking.email}</p>
                <p><strong>Date:</strong> {new Date(booking.date).toLocaleDateString()}</p>
                <p><strong>Time:</strong> {booking.time}</p>
                <p><strong>Guests:</strong> {booking.guests}</p>
                <button className="delete-btn" onClick={() => handleDelete(booking.id)}>
                  Delete
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
