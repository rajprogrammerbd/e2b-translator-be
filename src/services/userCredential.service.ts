require('dotenv').config();
import { logger } from '../middlewares/winston';
import axios, { AxiosError } from 'axios';

axios.defaults.headers.common['Authorization'] = process.env.AUTHORIZATION_CODE as string || '';

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

function loginUser(email: string, password: string) {
    return new Promise(async (resolve, reject) => {
            await axios.post(`${process.env.USERS_REPO_ACCESS_URL}/auth/login`, { email, password }).then((loggedIn: any) => {
            
            const { name, userEmail, token, AccessType } = loggedIn.data;
            const data = { success: true, name, userEmail, token, accessType: AccessType };
            resolve(data);

        }).catch((err: AxiosError) => {
            reject(err.response?.data)
        });
    });
}

function deleteUser(email: string, token: string ) {
    return new Promise(async (resolve, reject) => {
        try {
            const deletedUser = await axios.delete(`${process.env.USERS_REPO_ACCESS_URL}/auth/delete`, { headers: {
                'Authorization': process.env.AUTHORIZATION_CODE as string || '',
                Cookie: `LOGIN_ACCESS_COOKIE=${token}`,
            }, data: { email } });

            resolve(deletedUser.data);
        } catch (err: any) {
            reject(err.response.data);
        }
    });
}

export default {
    createUser,
    loginUser,
    deleteUser,
}
