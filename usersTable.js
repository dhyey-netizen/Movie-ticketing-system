var sql = require('mysql2')

var con = sql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'priyansh',
    database: 'movie_ticketing'
})

con.connect(function (err) {
    if (err) throw err
    console.log('Connected')

    con.query('CREATE TABLE users (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255), email VARCHAR(255), password VARCHAR(255), created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);', function (err, result) {
        if (err) throw err
        console.log('Table Created.')
    })
})