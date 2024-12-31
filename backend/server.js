const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Initialize express app
const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});
// MySQL Connection
const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '16122003',
    database: 'olp',
});

// Secret key for JWT
const JWT_SECRET = 'your_jwt_secret_key';

// User Registration Route
app.post('/api/register', (req, res) => {
    const { username, email, password } = req.body;

    // Validate input fields
    if (!username || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    // Hash password before saving
    bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
            return res.status(500).json({ message: 'Error hashing password' });
        }

        // Save the new user to the database
        const query = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
        db.query(query, [username, email, hashedPassword], (err, result) => {
            if (err) {
                return res.status(500).json({ message: 'Error saving user' });
            }
            res.status(201).json({ message: 'User registered successfully' });
        });
    });
});

// User Login Route
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    // Find user by username
    const query = 'SELECT * FROM users WHERE username = ?';
    db.query(query, [username], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Error logging in' });
        }

        if (results.length === 0) {
            return res.status(400).json({ message: 'User not found' });
        }

        // Compare passwords
        const user = results[0];
        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) {
                return res.status(500).json({ message: 'Error comparing passwords' });
            }

            if (!isMatch) {
                return res.status(400).json({ message: 'Invalid credentials' });
            }

            // Generate a JWT token
            const token = jwt.sign({ userId: user.id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });
            res.json({ token });
        });
    });
});


// Protect routes with JWT Authentication Middleware
const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(403).send('Access denied');
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).send('Invalid token');
        }
        req.user = user;
        next();
    });
};

// Booking Route
app.post('/api/book', authenticateToken, (req, res) => {
    const { course, trainee, date, slot } = req.body;
    const userId = req.user.userId;

    if (!course || !trainee || !date || !slot) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    const query = 'INSERT INTO bookings (user_id, course, trainee, booking_date, slot_time) VALUES (?, ?, ?, ?, ?)';
    db.query(query, [userId, course, trainee, date, slot], (err, result) => {
        if (err) {
            console.error('SQL Error:', err.message);
            return res.status(500).json({ message: 'Failed to save booking' });
        }
        res.status(201).json({ message: 'Booking added successfully' });
    });
});
app.get('/api/bookings/:id', authenticateToken, (req, res) => {
    const bookingId = req.params.id;

    const query = 'SELECT * FROM bookings WHERE id = ?';
    db.query(query, [bookingId], (err, results) => {
        if (err) {
            console.error('SQL Error:', err.message);
            return res.status(500).json({ error: 'Failed to fetch booking details' });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: 'Booking not found' });
        }
        const booking = results[0];
        booking.booking_date = new Date(booking.booking_date).toISOString().split('T')[0]; // Format the date
        res.json(booking);
    });
});

// Get User's Bookings
app.get('/api/bookings', authenticateToken, (req, res) => {
    const userId = req.user.userId;

    const query = 'SELECT * FROM bookings WHERE user_id = ?';
    db.query(query, [userId], (err, results) => {
        if (err) {
            return res.status(500).send('Error retrieving bookings');
        }
        res.json(results);
    });
});

// Update booking API
app.put('/api/bookings/:id', (req, res) => {
    const bookingId = req.params.id;
    const { course, trainee, date, slot } = req.body;

    const query = `UPDATE bookings 
                   SET course = ?, trainee = ?, booking_date = ?, slot_time = ?
                   WHERE id = ?`;

    db.query(query, [course, trainee, date, slot, bookingId], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Failed to update booking' });
        }
        res.json({ message: 'Booking updated successfully' });
    });
});


// Route to get protected test.html page (only accessible with a valid token)
app.get('/Home.html', authenticateToken, (req, res) => {
    res.sendFile('Home.html', { root: __dirname }); // Serve the test.html page to logged-in users
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
