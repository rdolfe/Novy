const { Sequelize } = require('sequelize');
const dbConfig = require('../config/db');

// Initialize Sequelize
const sequelize = new Sequelize(dbConfig.DB_NAME, dbConfig.DB_USER, dbConfig.DB_PASSWORD, {
    host: dbConfig.DB_HOST,
    dialect: 'mysql', // or 'postgres', 'sqlite', etc.
    port: dbConfig.DB_PORT,
});

// Test the database connection
sequelize.authenticate()
    .then(() => {
        console.log('Connection to the database has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });

// Export the sequelize instance
module.exports = sequelize;