import express from 'express';
import jwt from 'jsonwebtoken';
import cookie from 'cookie';
import Database from '../config/db.config';
import { logger } from '../middlewares/winston';

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
        } else if (req?.headers?.authorization !== undefined) {
            try {
                const token = req?.headers?.authorization.replace('Bearer ', '');
                jwt.verify(token, process.env.JSON_PRIVATE_KEY as string);
                req.isLogin = true;
            } catch (err: any) {
                req.isLogin = false;
            }

            next();
        } else req.isLogin = false;

        next();
    } else {
        logger.error({ message: 'Failed to connect with the database' });
        res.status(500).send({ message: 'Internal Error' });
    }
}

export default isLogin;
