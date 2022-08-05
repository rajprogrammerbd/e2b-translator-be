import userSchema, { user } from '../config/schema/user';
import Database from '../config/db.config';
import { hashSync, compareSync } from 'bcrypt';
import jwt from "jsonwebtoken";

export const User = Database.prepare(userSchema, 'user');

interface IPerson {
    name: string;
    email: string;
    password: string;
    userName: string;
}

async function createUser(person: IPerson) {
    const { name, email, password, userName } = person;

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
}

async function loginUser(email: string, password: string) {
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
            userEmail: user.email,
            token: token
        };
    });
}

export default {
    createUser,
    loginUser,
}
