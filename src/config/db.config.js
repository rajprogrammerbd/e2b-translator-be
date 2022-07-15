require('dotenv').config();
const mongoose = require('mongoose');

const URL = process.env.MONGODB_ACCESS_URL;

const access = {
    connected: false
};

class Database {
    static async connect() {
        try {
            const status = await mongoose.connect(URL);
            access.connected = true;
            return status;
        } catch (err) {
            return err;
        }
    }

    static isSuccess() {
        return access.connected;
    }

    static prepare(schema, modelName) {
        if (!mongoose.models[modelName]) {
            return mongoose.model(modelName, schema);
          }
          else {
            return mongoose.models[modelName];
          }
    }
};

module.exports = Database;
