import express from 'express';
import userCredentialService from "../services/userCredential.service";

async function saveUser(req: express.Request, res: express.Response) {
    try {
        const { name, email, password, userName } = req.body;

        if (name && email && password && userName) {
            const person = { name, email, password, userName };

            res.json(await userCredentialService.createUser(person));
        } else res.status(404).send({ message: 'User needs to send all required data' });

    } catch (err: any) {
        throw new Error(err);
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
                throw new Error(err);
            }
        }
    } else res.status(404).send({ message: 'User needs to send all required data' });
}

function logoutUser(req: express.Request, res: express.Response) {
    res.cookie('LOGIN_ACCESS_COOKIE', 'InvalidCookieSend', { maxAge: 360000, secure: true, sameSite: 'none' }).end();
}

export default {
    saveUser,
    loginUser,
    logoutUser,
}
