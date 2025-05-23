// Entry point of the backend server
require('dotenv').config();
const dbconnection = require('./db/connection');
const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;
const volunteerRoutes = require('./routes/volunteerRoutes');
const cors = require("cors");
app.use(express.json());


// Enable All CORS Requests
app.use(
  cors({
    origin: [
      "http://localhost:5174",
      "http://localhost:5173",
      "*",
    ],
    credentials: true,
  })
);

// Route to display the initial message on browser
app.get('/', (req, res) => {
  res.send('HELP-FRESHERS-BACKEND BACKEND API');
});

// TODO: Add routes and middleware
// Routes
app.use('/api/volunteers', volunteerRoutes);

app.listen(PORT, () => {
  console.log(`Server is up and running at http://localhost:${PORT} 🚀`);
});