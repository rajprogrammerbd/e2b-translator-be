import userSchema, { user } from '../config/schema/user';
import Database from '../config/db.config';
import { hashSync, compareSync } from 'bcrypt';
import jwt from "jsonwebtoken";

const User = Database.prepare(userSchema, 'user');

interface IPerson {
    name: string;
    email: string;
    password: string;
    userName: string;
}

async function createUser(person: IPerson) {
    const { name, email, password, userName } = person;

    if (Database.isSuccess()) {
        const searchUser = await User.find({ email });
        if (searchUser.length > 0) throw new Error('User is already exist');

        const newUser = new User({
            name,
            email,
            password: hashSync(password, 10),
            createdTime: Date.now(),
            userName
        });

        try {
            const res = await newUser.save();
            return {
                success: true,
                message: 'User created successfully',
                user: { name: res.name, email: res.email }
            };
        } catch (err: any) {
            throw new Error(err);
        }

    } else return new Error("database is not connected");
}

async function loginUser(email: string, password: string) {
    if (Database.isSuccess()) {
        return User.findOne({ email }).then((user: user) => {
            if (!user) {
                throw new Error("Couldn't able to find user");
            }

            if (!compareSync(password, user.password)) {
                throw new Error("Incorrect passport");
            }

            const payload = {
                email: user.email,
                id: user._id
            };

            const token = jwt.sign(payload, process.env.JSON_PRIVATE_KEY as string, { expiresIn: '1d' });

            return {
                success: true,
                name: user.name,
                email: user.email,
                token: `Bearer ${token}`
            };
        })
    } else return new Error("database is not connected");
}

export default {
    createUser,
    loginUser,
}
