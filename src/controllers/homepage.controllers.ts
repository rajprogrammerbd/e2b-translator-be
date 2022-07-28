import express from 'express';
import homePageServices from '../services/homepage.services';

async function defaultHome(req: express.Request, res: express.Response) {
    try {
        res.json(await homePageServices.getHomePage());
    } catch (err: any) {
        throw new Error(err);
    }
}

export default {
    defaultHome,
};
