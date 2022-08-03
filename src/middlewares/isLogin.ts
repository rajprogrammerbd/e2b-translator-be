import express from 'express';
import jwt from 'jsonwebtoken';
import cookie from 'cookie';
import Database from '../config/db.config';

function isLogin(req: express.Request, res: express.Response, next: express.NextFunction) {
    const isConnected = Database.isSuccess();
    if (isConnected) {
        if (req.headers.cookie !== undefined) {
            try {
                const cookies = cookie.parse(req.headers.cookie);
                jwt.verify(cookies.LOGIN_ACCESS_COOKIE, process.env.JSON_PRIVATE_KEY as string);
                req.isLogin = true;
            } catch (err: any) {
                req.isLogin = false;
            }
        } else req.isLogin = false;

        next();
    } else {
        res.status(500).send({ message: 'Internal Error' });
    }
}

export default isLogin;
