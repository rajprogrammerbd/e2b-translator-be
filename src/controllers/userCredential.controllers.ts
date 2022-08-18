import express from 'express';
import userCredentialService from "../services/userCredential.service";
import { logger } from '../middlewares/winston';

async function saveUser(req: express.Request, res: express.Response) {
    try {
        const { name, email, password, userName, userType } = req.body;

        if (name && email && password && userName && userType) {
            const person = { name, email, password, userName, userType };
            const responseData = await userCredentialService.createUser(person);

            res.send(responseData);
        } else res.status(404).send({ message: 'User needs to send all required data' });

    } catch (err: any) {
        logger.error(err);
        res.status(500).send({ message: err?.message });
    }
}

async function loginUser(req: express.Request, res: express.Response) {
    const { email, password } = req.body;
    if (email && password) {
        if (req.isLogin) {
            res.status(406).send({ message: 'User already logged in' });
        } else {
            try {
                const value = await userCredentialService.loginUser(email, password);
                const { success, name, userEmail, token } = value;
                res.cookie('LOGIN_ACCESS_COOKIE', token, { maxAge: 360000, secure: true, sameSite: 'none' }).send({ success, name, email: userEmail });
            } catch (err: any) {
                logger.error(err);
                throw new Error(err);
            }
        }
    } else res.status(404).send({ message: 'User needs to send all required data' });
}

function logoutUser(req: express.Request, res: express.Response) {
    if (req.isLogin) {
        res.cookie('LOGIN_ACCESS_COOKIE', 'InvalidCookieSend', { maxAge: 360000, secure: true, sameSite: 'none' }).end();
        return;
    }
    
    res.status(500).send({ message: 'User needs to be login' });
}

export default {
    saveUser,
    loginUser,
    logoutUser,
}
