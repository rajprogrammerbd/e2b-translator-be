import express from 'express';
import jwt from 'jsonwebtoken';
import cookie from 'cookie';
import Database from '../config/db.config';
import { logger } from '../middlewares/winston';

function isLogin(req: express.Request, res: express.Response, next: express.NextFunction) {
    const isConnected = Database.isSuccess();

    if (isConnected) {
        if (req?.headers?.cookie !== undefined && req?.headers?.authorization !== undefined) {
            try {
                const cookies = cookie.parse(req.headers.cookie);
                const verifiedUser: any = jwt.verify(cookies.LOGIN_ACCESS_COOKIE, process.env.JSON_PRIVATE_KEY as string);

                const token = req?.headers?.authorization.replace('Bearer ', '');
                jwt.verify(token, process.env.JSON_PRIVATE_KEY as string);


                req.isLogin = true;
                req.token = cookies.LOGIN_ACCESS_COOKIE;
                req.userEmail = verifiedUser.email;
            } catch (err: any) {
                req.isLogin = false;
            }

        } else {
            req.isLogin = false;
            req.token = undefined;
        }

        next();
    } else {
        logger.error({ message: 'Failed to connect with the database' });
        res.status(500).send({ message: 'Internal Error' });
    }
}

export default isLogin;
