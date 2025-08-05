require('dotenv').config();

const express = require('express');
const cors = require('cors');
const session = require('express-session');

const app = express();
const port = process.env.PORT || 3009;

app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['POST', 'PUT', 'GET', 'OPTIONS', 'HEAD'],
  credentials: true
}))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(session({
  secret: 'yourSecretKeyHere', 
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, 
    maxAge: 1000 * 60 * 60 * 2 
  }
}))

app.set('json spaces', 2)

const path = require ('path')

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
})

const apartments = require('./routes/apartments')
app.use('/apartments', apartments)

const dataPool = require('./database/db.js')

const authorize = require('./routes/authorize');
app.use('/auth', authorize);

const { isAuthenticated } = require('./middleware/middleware');
app.get('/dashboard', isAuthenticated, (req, res) => {
  res.send(`Welcome, ${req.session.user.name}!`);
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
