require('dotenv').config();

const express = require('express');
const cors = require('cors');
const session = require('express-session');

const app = express();
const port = process.env.PORT || 3009;

const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(cors({
  origin: 'http://88.200.63.148:4009',
  methods: ['POST', 'PUT', 'GET', 'OPTIONS', 'HEAD'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}));

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

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
})

const apartments = require('./routes/apartments')
app.use('/apartments', apartments)

const myApartments = require('./routes/myApartments')
app.use('/my-apartments', myApartments)

const StudentListings = require('./routes/studentListings')
app.use('/student-listings', StudentListings)

const MyStudentListings = require('./routes/myListings')
app.use('/my-student-listings', MyStudentListings)

const ApplicationRequest = require('./routes/applicationRequest')
app.use('/application-request', ApplicationRequest)

const Profile = require('./routes/profile');
app.use('/profile', Profile)

const Messages = require('./routes/messages');
app.use('/messages', Messages)

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
