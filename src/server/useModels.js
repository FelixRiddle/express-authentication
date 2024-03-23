const { Models } = require("felixriddle.ts-app-models");

/**
 * For every route create the models class
 * 
 * This class creates a pool of connections to use for each route.
 * 
 * This is wrong, but it's better than creating one every time you need to use the models like I did before.
 * 
 * The best way would be to use the same model for every connection.
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
module.exports = function useModels(req, res, next) {
    // Every route will use models
    req.models = new Models();
    
    next();
}
