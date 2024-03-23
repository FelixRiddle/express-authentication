const { Models } = require("felixriddle.ts-app-models");

/**
 * General models
 * 
 * This route will use a single instance of sequelize for every connection(How it should be).
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
module.exports = function useGeneralModels() {
    const models = new Models();
    
    // The middleware
    return function generalModelMiddleware(req, res, next) {
        // Every route will use models
        req.models = models;
        
        next();
    }
}
