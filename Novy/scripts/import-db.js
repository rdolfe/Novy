const fs = require('fs');
const path = require('path');
const mysql = require('mysql2');

// Load environment variables
require('dotenv').config();

// Create a connection to the database
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// Function to import data
const importData = async () => {
    const dataFilePath = path.join(__dirname, 'data.json'); // Adjust the path as needed
    const data = JSON.parse(fs.readFileSync(dataFilePath, 'utf-8'));

    // Example: Assuming data is an array of objects to insert into a 'users' table
    const query = 'INSERT INTO users (name, email) VALUES ?';
    const values = data.map(item => [item.name, item.email]);

    connection.query(query, [values], (error, results) => {
        if (error) {
            console.error('Error importing data:', error);
            return;
        }
        console.log('Data imported successfully:', results.affectedRows);
        connection.end();
    });
};

// Connect to the database and import data
connection.connect(err => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the database.');
    importData();
});