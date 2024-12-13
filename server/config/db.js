const mongoose = require('mongoose');
const connectDB = async () => {
    try {
        const MONGO_URI = "mongodb://localhost:27017/bloggingApp";
        await mongoose.connect(MONGO_URI,{
            useNewUrlParser:true,
            useUnifiedTopology:true,
        });
        console.log("MongoDb Connected");
    } catch (error) {
        console.error(error.message);
        process.exit(1);
    }
};

module.exports = connectDB;