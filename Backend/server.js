const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const port = 3000;

// Middleware to parse incoming requests
app.use(bodyParser.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/loginDB', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.log('Error connecting to MongoDB:', err));

// Define a user schema and model
const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

const User = mongoose.model('User', userSchema);

// Handle form submission
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    // Simple validation (you can add more complex validation as needed)
    if (!email || !password) {
        return res.status(400).send('All fields are required');
    }

    // Check if the user exists in the database
    User.findOne({ email: email, password: password }, (err, user) => {
        if (err) {
            return res.status(500).send('Error checking the database');
        }

        if (user) {
            return res.send('Login successful');
        } else {
            return res.status(401).send('Invalid email or password');
        }
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
