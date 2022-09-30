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
                const value: any = await userCredentialService.loginUser(email, password);
                const { success, name, userEmail, token, accessType } = value;

                res.cookie('LOGIN_ACCESS_COOKIE', token, { maxAge: 360000, secure: true, sameSite: 'none' }).send({ success, name, email: userEmail, accessType });
            } catch (err: any) {
                logger.error(err);
                res.status(500).send({ message: err.message });
            }
        }
    } else res.status(404).send({ message: 'User needs to send all required data' });
}

function logoutUser(req: express.Request, res: express.Response) {
    if (req.isLogin) {
        res.cookie('LOGIN_ACCESS_COOKIE', 'InvalidCookieSend', { maxAge: 360000, secure: true, sameSite: 'none' }).end();
        return;
    }
    
    res.status(500).send({ message: 'User needs to be login,' });
}

async function deleteAUser(req: express.Request, res: express.Response) {
    const { email } = req.body;
    if ( email !== undefined ) {
        if (req.userEmail !== undefined && req.token !== undefined) {
            try {
                const responseData = await userCredentialService.deleteUser(email, req.token);
    
                if (email.toLowerCase() === req.userEmail) {
                    res.cookie('LOGIN_ACCESS_COOKIE', 'InvalidCookieSend', { maxAge: 360000, secure: true, sameSite: 'none' }).send(responseData);
                } else res.send(responseData);
            } catch (err: any) {
                res.status(500).send(err);
            }
        } else res.status(500).send({ message: "User needs to be login" });
    } else res.status(404).send({ message: "User needs to send all required data" });
}

export default {
    saveUser,
    loginUser,
    logoutUser,
    deleteAUser,
}
