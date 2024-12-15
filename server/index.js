const express = require("express");
const connectDB = require("./config/db");
const bodyParser = require("body-parser");
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/postRoutes');

const app = express();

connectDB();

app.use(bodyParser.json());
app.use(cors());

const PORT = process.env.PORT||5000;

//Use auth routes
app.use("/api/auth",authRoutes);
//Use post routes
app.use("/api/posts",postRoutes);

app.listen(PORT,()=>{
    console.log("Server running on port 5000");
});