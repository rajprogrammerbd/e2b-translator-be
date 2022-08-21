declare global {
    namespace Express {
        interface Request {
            isLogin: boolean;
            token: string | undefined;
        }
    }
}

export = global;
