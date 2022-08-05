require('dotenv').config();
import mongoose from 'mongoose';

const URL = process.env.MONGODB_ACCESS_URL as string;

const access = {
    connected: false
};

class Database {
    static async connect(): Promise<typeof mongoose | Error> {
        try {
            const status = await mongoose.connect(URL);
            access.connected = true;
            return status;
        } catch (err: any) {
            access.connected = false;
            return Promise.reject(err);
        }
    }

    static isSuccess(): boolean {
        return access.connected;
    }

    static prepare(schema: any, modelName: any): any {
        if (!mongoose.models[modelName]) {
            return mongoose.model(modelName, schema);
          }
          else {
            return mongoose.models[modelName];
          }
    }
}

export default Database;
