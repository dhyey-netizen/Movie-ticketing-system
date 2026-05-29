var mysql = require('mysql2')

var con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'priyansh',
    database: 'movie_ticketing'
})

con.connect(function (err) {
    if (err) throw err
    console.log('Connected')

    con.query('create table movies (id INT AUTO_INCREMENT PRIMARY KEY, title VARCHAR(255), description TEXT, poster_url VARCHAR(500), genre VARCHAR(100), release_date DATE, duration INT, rating FLOAT, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);', function (err, result) {
        if (err) throw err
        console.log('Table Created.')
    })
})