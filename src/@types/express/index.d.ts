declare global {
    namespace Express {
        interface Request {
            isLogin: boolean;
            token: string | undefined;
            userEmail: string | undefined;
        }
    }
}

export = global;
