
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const stripe = require('stripe')('your_stripe_secret_key');
const app = express();

app.use(bodyParser.json());
app.use(cors());

mongoose.connect('mongodb://localhost/it_solutions', { useNewUrlParser: true, useUnifiedTopology: true });

// Schemas
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'user' }
});

const TicketSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, default: 'open' }
});

const PackageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true }
});

const User = mongoose.model('User', UserSchema);
const Ticket = mongoose.model('Ticket', TicketSchema);
const Package = mongoose.model('Package', PackageSchema);

// Middleware for authentication
const authenticateJWT = (req, res, next) => {
  const token = req.headers.authorization.split(' ')[1];
  if (!token) {
    return res.sendStatus(403);
  }

  jwt.verify(token, 'your_jwt_secret', (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }
    req.user = user;
    next();
  });
};

// Routes
app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = new User({ username, password: hashedPassword });
    await user.save();
    res.status(201).send('User registered');
  } catch (error) {
    res.status(500).send('Error registering user');
  }
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });
  if (!user) {
    return res.status(400).send('User not found');
  }

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    return res.status(400).send('Invalid password');
  }

  const token = jwt.sign({ id: user._id, role: user.role }, 'your_jwt_secret');
  res.json({ token });
});

app.post('/tickets', authenticateJWT, async (req, res) => {
  const { title, description } = req.body;

  const ticket = new Ticket({
    userId: req.user.id,
    title,
    description
  });

  try {
    await ticket.save();
    res.status(201).send('Ticket created');
  } catch (error) {
    res.status(500).send('Error creating ticket');
  }
});

app.get('/tickets', authenticateJWT, async (req, res) => {
  const tickets = await Ticket.find({ userId: req.user.id });
  res.json(tickets);
});

app.post('/packages', async (req, res) => {
  const { name, description, price } = req.body;

  const pkg = new Package({ name, description, price });

  try {
    await pkg.save();
    res.status(201).send('Package created');
  } catch (error) {
    res.status(500).send('Error creating package');
  }
});

app.post('/purchase', authenticateJWT, async (req, res) => {
  const { packageId } = req.body;
  const pkg = await Package.findById(packageId);

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [{
      price_data: {
        currency: 'usd',
        product_data: {
          name: pkg.name,
          description: pkg.description,
        },
        unit_amount: pkg.price * 100,
      },
      quantity: 1,
    }],
    mode: 'payment',
    success_url: 'https://your-domain.com/success',
    cancel_url: 'https://your-domain.com/cancel',
  });

  res.json({ id: session.id });
});

// Start server
app.listen(5000, () => {
  console.log('Server running on port 5000');
});
