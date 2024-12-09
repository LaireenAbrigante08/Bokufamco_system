const mysql = require('mysql2');

// Setup the MySQL connection
const db = mysql.createConnection({
    host: 'localhost',  // Ensure this is correct
    user: 'root',       // Ensure this is correct
    password: '',       // Your MySQL password
    database: 'coops1' // Your database name
});

// Test the connection
db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err);
        return;
    }
    console.log('Connected to the database');
});

module.exports = db;
