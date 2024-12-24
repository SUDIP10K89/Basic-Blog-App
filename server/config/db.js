const mongoose = require('mongoose');
const connectDB = async () => {
    try {
        const MONGO_URI = "mongodb+srv://sudip10k89:KHGJIGbk4u6EYMDO@cluster0.wzjdc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
        await mongoose.connect(MONGO_URI);
        console.log("MongoDb Connected");
    } catch (error) {
        console.error(error.message);
        process.exit(1);
    }
};

module.exports = connectDB;