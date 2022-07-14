const homePageServices = require('../services/homepage.services');

async function defaultHome(req, res) {
    try {
        res.json(await homePageServices.getHomePage());
    } catch (err) {
        throw new Error(err);
    }
}

module.exports = {
    defaultHome,
};
