require('dotenv').config();
const mongoose = require('mongoose');

const URL = process.env.MONGODB_ACCESS_URL;

class Database {
    static async connect() {
        return await mongoose.connect('mongodb+srv://rajprogrammerbd:Casino123@cluster0.h754vo1.mongodb.net/?retryWrites=true&w=majority');
    }
};

module.exports = Database;
