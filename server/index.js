const express = require("express");
const connectDB = require("./config/db");
const bodyParser = require("body-parser");
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/postRoutes');
const path = require('path');

require('dotenv').config();

const app = express();

connectDB();

app.use(bodyParser.json());
app.use(cors());

const PORT = process.env.PORT||5000;

//Use auth routes
app.use("/api/auth",authRoutes);
//Use post routes
app.use("/api/posts",postRoutes);

//Use the static build folder
app.use(express.static(path.join(__dirname,"/client/dist")));

//Render client
app.get('*',(req,res)=>{
    res.sendFile(path.join(__dirname,"/client/dist/index.html"));
});

app.listen(PORT,()=>{
    console.log("Server running on port 5000");
});