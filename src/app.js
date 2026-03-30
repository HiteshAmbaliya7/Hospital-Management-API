const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const methodOverride = require('method-override');

const app = express();
const path = require("path");


app.use(methodOverride('_method'));
app.use(cookieParser());


app.use(cors({
  origin: 'http://localhost:3000',  
  // origin: 'http://localhost:4200', // Angular default port
  credentials: true  
}));

// Middleware
app.set("view engine", "ejs");
// app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(logs());


app.use('/api/auth', require('./routes/authRoutes'));
app.use('/patient',require("./routes/PatientRoutes"));




// Test Route
// app.get('/', (req, res) => {
    //   res.json({ message: 'Hospital Management API is running!' });
    // });
    
app.set("views", path.join(__dirname, "..", "views"));
    module.exports = app;
    