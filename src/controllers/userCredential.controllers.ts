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
        try {
            const value = await userCredentialService.loginUser(email, password);
            res.send(value);
        } catch (err: any) {
            throw new Error(err);
        }
    } else res.status(404).send({ message: 'User needs to send all required data' });
}

export default {
    saveUser,
    loginUser,
}
