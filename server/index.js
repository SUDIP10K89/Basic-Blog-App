const express = require("express");
const connectDB = require("./config/db");
const bodyParser = require("body-parser");
const authRoutes = require('./routes/authRoutes');

const app = express();

connectDB();

app.use(bodyParser.json());

const PORT = process.env.PORT||5000;

//Use auth routes
app.use("/api/auth",authRoutes);

app.listen(PORT,()=>{
    console.log("Serer running on port 5000");
});