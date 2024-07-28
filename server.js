const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const stripe = require('stripe')('your_stripe_secret_key');
const app = express();

app.use(bodyParser.json());
app.use(cors());

mongoose.connect('mongodb://localhost/it_solutions', { useNewUrlParser: true, useUnifiedTopology: true });

// Schemas
const UserSchema = new mongoose.Schema({ ... });
const TicketSchema = new mongoose.Schema({ ... });
const PackageSchema = new mongoose.Schema({ ... });

const User = mongoose.model('User', UserSchema);
const Ticket = mongoose.model('Ticket', TicketSchema);
const Package = mongoose.model('Package', PackageSchema);

// Middleware for authentication
const authenticateJWT = (req, res, next) => { ... };

// Routes
app.post('/register', async (req, res) => { ... });
app.post('/login', async (req, res) => { ... });
app.post('/tickets', authenticateJWT, async (req, res) => { ... });
app.get('/tickets', authenticateJWT, async (req, res) => { ... });
app.post('/packages', async (req, res) => { ... });
app.post('/purchase', authenticateJWT, async (req, res) => { ... });

// Start server
app.listen(5000, () => {
  console.log('Server running on port 5000');
});
