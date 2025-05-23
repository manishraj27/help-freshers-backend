// Initiate connection to MongoDB
require('dotenv').config();
const mongoose = require('mongoose');
// initialised through devcli.vercel.app

const dburl = process.env.DB_URL || "mongodb://localhost:27017/help_freshers_backend_db";
mongoose.connect(dburl).then(() => {
    console.log("Connected to DB Successfully");
}).catch((err) => {
    console.log(err.message);
});