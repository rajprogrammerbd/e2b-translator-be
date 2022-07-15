const { default: mongoose } = require("mongoose");

const userSchema = {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    userName: { type: String, required: true },
    createdTime: Date,
};

module.exports = userSchema;
