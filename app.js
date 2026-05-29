var express = require('express')
var sql = require('mysql2')
var path = require('path')
var app = express()
var port = 8000

const movies = require('./data')

let usrData = {
    id: undefined,
    email: undefined,
    password: undefined
}

// var con = sql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: 'Ramp6060',
//     database: 'movie_ticketing'
// })

var con = sql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'priyansh',
    database: process.env.DB_NAME || 'movie_ticketing'
})

app.use(express.json())
app.use(express.static(__dirname + '/public'))

app.get('', (req, res) => {
    return res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

app.get('/login', (req, res) => {
    return res.sendFile(path.join(__dirname, 'public', 'login.html'))
})

app.post('/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email & Password are required!" });
    }

    con.query(`SELECT id, name, email FROM users WHERE email = ? AND password = ?`, [email, password], (err, result) => {
        if (err) return res.status(500).json({ message: "Database error during login" });

        if (result.length === 0) {
            return res.status(401).json({ message: "Invalid email or password!" });
        }

        usrData.id = result[0].id;
        usrData.email = result[0].email;
        usrData.password = password;

        return res.json({message: "Login successful!", user: result[0]});
    });
});

app.post('/register', (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: 'All fields are required!' });
    }

    con.query('SELECT * FROM users WHERE email = ?', [email], (err, result) => {
        if (err) return res.status(500).json({ message: 'Database error while checking user.' });

        if (result.length > 0) {
            return res.status(400).json({ message: 'Email already registered!' });
        }

        con.query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, password], (err2, result2) => {
                if (err2) {
                    console.error('Error inserting user:', err2);
                    return res.status(500).json({ message: 'Database error while registering user.' });
                }
                console.log('New user registered:', name);
                return res.status(200).json({ message: 'Registration successful!' });
            }
        );
    });
});

app.get('/book', (req, res) => {
    return res.sendFile(path.join(__dirname, 'public', 'movieBook.html'))
})

app.post('/book', (req, res) => {
    const bookingData = req.body;
    let { user_id, movie_id, booking_date, quantity, total_price, selected_seats } = bookingData;

    if (!user_id && usrData.id) {
        user_id = usrData.id;
    }

    if (!user_id) {
        return res.status(400).json({ message: 'User not logged in or missing user_id' });
    }

    con.query(`INSERT INTO booking (user_id, movie_id, booking_date, quantity, total_price) VALUES (?, ?, ?, ?, ?)`, [user_id, movie_id, booking_date, quantity, total_price], (err, result) => {
        if (err) {
            console.error('Error inserting booking:', err);
            return res.status(500).json({ message: 'Database error', error: err.message });
        }

        const sqlquery = `INSERT INTO booked_seats (movie_id, seat_code, booking_date, user_id)
                          VALUES (?, ?, ?, ?)`;

        selected_seats.forEach((seat) => {
            con.query(sqlquery, [movie_id, seat, booking_date, user_id], (err) => {
                if (err) console.error('Error saving seat:', err);
            });
        });

        console.log(`Booking confirmed for user_id ${user_id}`);
        return res.status(200).json({ message: 'Booking confirmed successfully!' });
    });
});


app.get('/api/bookedSeats/:movieId', (req, res) => {
    const movieId = req.params.movieId

    con.query('SELECT seat_code FROM booked_seats WHERE movie_id = ?', [movieId], (err, result) => {
        if (err) {
            console.error("Error fetching booked seats:", err)
            return res.status(500).send("Error fetching booked seats")
        }

        return res.json(result.map(r => r.seat_code))
    })
})

app.put('/api/update', (req, res) => {
    if (!usrData.id && !usrData.email && !usrData.password) {
        return res.send('User is not logged in')
    }

    let userId = usrData.id

    const { booking_date, quantity, total_price, selected_seats, movie_id } = req.body

    con.query(`UPDATE booking SET booking_date = ?, quantity = ?, total_price = ? WHERE user_id = ? AND movie_id = ?`,
        [booking_date, quantity, total_price, userId, movie_id],
        (err) => {
            if (err) {
                console.error('Error updating booking:', err)
                return res.status(500).json({ message: 'Error updating booking' })
            }

            con.query(`DELETE FROM booked_seats WHERE user_id = ? AND movie_id = ?`, [userId, movie_id], (err) => {
                if (err) {
                    console.error('Error deleting old seats:', err)
                    return res.status(500).json({ message: 'Error updating booked seats' })
                }

                const sqlSeats = `INSERT INTO booked_seats (movie_id, seat_code, booking_date, user_id) VALUES (?, ?, ?, ?)`
                selected_seats.forEach((seat) => {
                    con.query(sqlSeats, [movie_id, seat, booking_date, userId], (err) => {
                        if (err) console.error('Error saving new seat:', err)
                    })
                })

                console.log('Booking updated successfully')
                return res.status(200).json({ message: 'Booking updated successfully!' })
            })
        }
    )
})

app.get('/api/sendData', (req, res) => {
    if (usrData.id && usrData.email && usrData.password) {
        return res.send(usrData)
    }
    return res.send('User not Logged In.')
})

app.get('/api/users', (req, res) => {
    con.query('SELECT id, name, email, password FROM users', (err, result) => {
        if (err) return res.send('Data not found')
        return res.json(result)
    })
})

app.post('/api/getdata', (req, res) => {
    let { id, email, password } = req.body

    usrData.id = id
    usrData.email = email
    usrData.password = password

    res.send('Data Recieved')
})

app.get('/api/movies', (req, res) => {
    res.json(movies);
})

// Delete feature code starting from here//


// -------------------------
// Fetch user bookings
// -------------------------
app.post('/api/myBookings', (req, res) => {
    const { email, password } = req.body;

    con.query('SELECT id FROM users WHERE email = ? AND password = ?', [email, password], (err, userResult) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        if (userResult.length === 0) return res.status(404).json({ error: 'Invalid email or password' });

        const userId = userResult[0].id;

        const sql = `
            SELECT s.id, s.movie_id, s.seat_code, s.booking_date
            FROM booked_seats s
            WHERE s.user_id = ?
            ORDER BY s.booking_date DESC
        `;

        con.query(sql, [userId], (err2, result) => {
            if (err2) return res.status(500).json({ error: 'Error fetching bookings' });
            res.json(result);
        });
    });
});

const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "1234";

app.post('/api/admin/login', (req, res) => {
    const { username, password } = req.body;

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        return res.json({ success: true });
    } else {
        return res.json({ success: false });
    }
});

app.get('/api/admin/activeUsers', (req, res) => {
    const sql = `
        SELECT COUNT(*) AS activeUsers
        FROM users
    `;
    con.query(sql, (err, result) => {
        if (err) return res.status(500).json({ error: "Database error" });
        res.json({ activeUsers: result[0].activeUsers });
    });
});

app.get('/api/admin/dailyRegistrations', (req, res) => {
    const sql = `
        SELECT DATE(created_at) AS date, COUNT(*) AS count
        FROM users
        GROUP BY DATE(created_at)
        ORDER BY DATE(created_at) DESC
        LIMIT 7
    `;
    con.query(sql, (err, result) => {
        if (err) return res.status(500).json({ error: "Database error" });

        res.json(result.reverse()); // so days appear oldest→latest
    });
});

app.delete('/api/deleteBooking/:id', (req, res) => {
    const seatId = req.params.id;

    con.query(`SELECT user_id, movie_id, seat_code FROM booked_seats WHERE id = ?`, [seatId], (err, seatResult) => {
        if (err) {
            console.error('Error finding seat:', err);
            return res.status(500).json({ error: 'Database error while finding seat' });
        }

        if (seatResult.length === 0) {
            return res.status(404).json({ error: 'Seat not found' });
        }

        const { user_id, movie_id, seat_code } = seatResult[0];

        con.query('DELETE FROM booked_seats WHERE id = ?', [seatId], (err2, result2) => {
            if (err2) {
                console.error('Error deleting seat:', err2);
                return res.status(500).json({ error: 'Error deleting seat' });
            }

            con.query(
                'SELECT COUNT(*) AS remaining FROM booked_seats WHERE user_id = ? AND movie_id = ?',
                [user_id, movie_id],
                (err3, countResult) => {
                    if (err3) {
                        console.error('Error checking remaining seats:', err3);
                        return res.status(500).json({ error: 'Error checking seats' });
                    }

                    const remaining = countResult[0].remaining;

                    if (remaining === 0) {
                        con.query('DELETE FROM booking WHERE user_id = ? AND movie_id = ?', [user_id, movie_id],
                            (err4) => {
                                if (err4) {
                                    console.error('Error deleting booking:', err4);
                                    return res.status(500).json({ error: 'Error deleting booking' });
                                }

                                console.log(`Deleted seat ${seat_code} and removed empty booking.`);
                                return res.json({
                                    message: `Deleted seat ${seat_code} and removed empty booking.`,
                                });
                            }
                        );
                    } else {
                        console.log(`Deleted seat ${seat_code}`);
                        return res.json({ message: `Deleted seat ${seat_code} successfully.` });
                    }
                }
            );
        });
    });
});


app.get('/admin', (req, res) => {
    return res.sendFile(path.join(__dirname, 'public', 'adminDashboard.html'));
});

app.listen(port, () => {
    console.log(`The Server is running on ${port}`)
})