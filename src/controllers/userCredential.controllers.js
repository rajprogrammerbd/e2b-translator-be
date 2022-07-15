const userCredentialService = require("../services/userCredential.service");

async function saveUser(req, res) {
    try {
        const { name, email, password, userName } = req.body;

        if (name && email && password && userName) {
            const person = { name, email, password, userName };

            res.json(await userCredentialService.createUser(person));
        } else res.status(404).send({ message: 'User needs to send all required data' });

    } catch (err) {
        throw new Error(err);
    }
}

async function loginUser(req, res) {
    const { email, password } = req.body;
    if (email && password) {
        try {
            const value = await userCredentialService.loginUser(email, password);
            console.log(value);
            res.send(value);
        } catch (err) {
            throw new Error(err);
        }
    } else res.status(404).send({ message: 'User needs to send all required data' });
}

module.exports = {
    saveUser,
    loginUser,
}
