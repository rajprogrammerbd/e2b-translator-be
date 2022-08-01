declare global {
    namespace Express {
        interface Request {
            isLogin: boolean;
        }
    }
}

export = global;
