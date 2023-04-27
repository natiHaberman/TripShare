const mongoose = require('mongoose');

// Connect to MongoDB database using mongoose
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URI, {
            useUnifiedTopology: true,
            useNewUrlParser: true
        });
    } catch (err) {
        console.error(err);
        throw(err);
    }
}

module.exports = connectDB