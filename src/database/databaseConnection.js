const Sequelize = require("sequelize");

const databaseConnection = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD ?? "", {
    host: process.env.DB_HOST ?? "localhost",
    port: process.env.DB_PORT ?? 3306,
    dialect: "mysql",
    define: {
        timestamps: true,
    },
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 60 * 1000,
    },
    operatorAliases: false,
    // Disable logging
    logging: false
});

module.exports = databaseConnection;
