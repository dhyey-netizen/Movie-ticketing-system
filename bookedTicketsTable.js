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

    con.query(`CREATE TABLE IF NOT EXISTS booked_seats (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT,
                movie_id INT NOT NULL,
                seat_code VARCHAR(10) NOT NULL,
                booking_date DATE NOT NULL
            );
        `, (err, result) => {
            if (err) throw err
            console.log("booked_seats table created or already exists.")
        }) 
})