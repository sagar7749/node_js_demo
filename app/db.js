'user strict';

var mysql = require('mysql');

//local mysql db connection
var connection = mysql.createConnection({
    host     : process.env.DB_HOST,
    user     : process.env.DB_USER,
    password : process.env.DB_PASS,
    database : process.env.DB_NAME,
    multipleStatements: true,
    charset : 'utf8mb4',
    collation:'utf8mb4_unicode_ci',
    timezone: 'UTC',
});

connection.connect(function(err) {
    if (err) throw err;
    console.log("Database Connected!");
});

module.exports = connection;