var sql = require('mysql2')

var con = sql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'priyansh',
    database: 'movie_ticketing'
})

con.connect((err) => {
    if (err) throw err
    console.log('Connted')

    con.query(`CREATE TABLE IF NOT EXISTS booking (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    user_id INT,
                    movie_id INT,
                    booking_date DATE,
                    quantity INT,
                    total_price DECIMAL
                );
            `, (err, result) => {
                if (err) throw err
                console.log('Table is Created.')
            })
})