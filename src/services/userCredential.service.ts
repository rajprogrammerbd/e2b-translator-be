require('dotenv').config();
import userSchema, { user } from '../config/schema/user';
import Database from '../config/db.config';
import { compareSync } from 'bcrypt';
import jwt from "jsonwebtoken";
import { logger } from '../middlewares/winston';
import axios, { AxiosError } from 'axios';

axios.defaults.headers.common['Authorization'] = process.env.AUTHORIZATION_CODE as string || '';

export const User = Database.prepare(userSchema, 'user');

interface ResponseType {
    success: boolean;
    message: string;
    user: {
        name: string;
        email: string;
    }
}

type ACCESS_TYPE = 'Admin' | 'User' | 'Temp';
interface IPerson {
    name: string;
    email: string;
    password: string;
    userName: string;
    userType: ACCESS_TYPE,
}

interface ErrorType {
    message: string;
}

async function createUser(person: IPerson): Promise<ResponseType | ErrorType> {
    return new Promise((resolve, reject) => {
        const { name, email, password, userName, userType } = person;

        axios.post<ResponseType>(`${process.env.USERS_REPO_ACCESS_URL}/auth/create`, { name, email, password, userName, userType }).then((succObj: any) => {
            resolve(succObj.data);
        }).catch((err: AxiosError) => {
            logger.error(err.response?.data);
            reject(err.response?.data);
        });
    });
}

async function loginUser(email: string, password: string) {
    return User.findOne({ email }).then((user: user) => {
        if (!user) {
            throw new Error("Couldn't able to find user");
        }

        if (!compareSync(password, user.password)) {
            throw new Error("Incorrect passport");
        }

        const payload = {
            email: user.email,
            id: user._id
        };

        const token = jwt.sign(payload, process.env.JSON_PRIVATE_KEY as string, { expiresIn: '1d' });

        return {
            success: true,
            name: user.name,
            userEmail: user.email,
            token: token
        };
    });
}

export default {
    createUser,
    loginUser,
}
