var express = require('express')
var sql = require('mysql2')
var path = require('path')
var app = express()
var cors = require('cors') // CORS for allowing frontend to access backend
var port = 8000

// Movie list
const movies = require('./data')

// CORS middleware
app.use(cors()) // Allow all origins for now

// Temporary user data (not recommended long-term)
let usrData = {
    id: undefined,
    email: undefined,
    password: undefined
}

// Database connection
var con = sql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Ramp6060',
    database: 'movie_ticketing'
})

// Serve static files from public folder
app.use(express.static(__dirname + '/public'))

// Default home page route
app.get('', (req, res) => {
    return res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

// Login page route
app.get('/login', (req, res) => {
    return res.sendFile(path.join(__dirname, 'public', 'login.html'))
})

// Parse JSON request bodies
app.use(express.json())

// Register/Login insert into DB
app.post('/login', (req, res) => {
    let { name, email, password } = req.body

    con.query(
        `INSERT INTO users (name, email, password) VALUES (?, ?, ?)`,
        [name, email, password],
        function (err) {
            if (err) throw err
            console.log('User Registered')
            return res.status(200).json({ message: "Registered Successfully" })
        }
    )
})

// Booking Page Route
app.get('/book', (req, res) => {
    return res.sendFile(path.join(__dirname, 'public', 'movieBook.html'))
})

// Movie ticket booking API
app.post('/book', (req, res) => {
    const bookingData = req.body
    let { user_id, movie_id, booking_date, quantity, total_price, selected_seats } = bookingData

    // Validate seat data
    if (!selected_seats || !Array.isArray(selected_seats)) {
        return res.status(400).json({ message: 'selected_seats must be an array.' })
    }

    // Insert booking
    con.query(
        `INSERT INTO booking (user_id, movie_id, booking_date, quantity, total_price)
        VALUES (?, ?, ?, ?, ?)`,
        [user_id, movie_id, booking_date, quantity, total_price],
        function (err) {
            if (err) {
                return res.status(500).json({ message: 'Database error', error: err.message })
            }

            // Insert each booked seat
            var seatQuery = `INSERT INTO booked_seats(movie_id, seat_code, booking_date) VALUES (?, ?, ?)`
            selected_seats.forEach(seat => {
                con.query(seatQuery, [movie_id, seat, booking_date], (err) => {
                    if (err) console.error("Error saving seat:", err)
                })
            })

            console.log('Booking Confirmed')
            return res.status(200).json({ message: 'Booking confirmed successfully!' })
        }
    )
})

// Fetch booked seats for a movie
app.get('/api/bookedSeats/:movieId', (req, res) => {
    const movieId = req.params.movieId

    con.query(
        'SELECT seat_code FROM booked_seats WHERE movie_id = ?',
        [movieId],
        (err, result) => {
            if (err) {
                console.error("Error fetching booked seats:", err)
                return res.status(500).send("Error fetching booked seats")
            }
            return res.json(result.map(r => r.seat_code))
        }
    )
})

// Debug route to check stored user login
app.get('/api/sendData', (req, res) => {
    if (usrData.id && usrData.email && usrData.password) {
        return res.send(usrData)
    }
    return res.send('User not logged in')
})

// Fetch all users
app.get('/api/users', (req, res) => {
    con.query('SELECT id, name, email, password FROM users', (err, result) => {
        if (err) return res.send('Data not found')
        return res.json(result)
    })
})

// Store temporary login data
app.post('/api/getdata', (req, res) => {
    let { id, email, password } = req.body
    usrData.id = id
    usrData.email = email
    usrData.password = password

    res.send('Data Received')
})

// Send movies list
app.get('/api/movies', (req, res) => {
    res.json(movies)
})

// ADMIN: Free/Delete a booked seat
app.delete('/api/removeSeat/:movieId', (req, res) => {
    const movieId = req.params.movieId
    const { seat } = req.body

    con.query(
        `DELETE FROM booked_seats WHERE movie_id = ? AND seat_code = ?`,
        [movieId, seat],
        (err) => {
            if (err) {
                console.error("Error removing seat:", err)
                return res.status(500).json({ error: "Error removing seat" })
            }
            console.log(`Seat ${seat} removed for movie ${movieId}`)
            res.json({ success: true })
        }
    )
})

// ADMIN: Update booked seat
app.put('/api/updateSeat/:movieId', (req, res) => {
    const movieId = req.params.movieId
    const { oldSeat, newSeat } = req.body

    // Check if new seat already booked
    con.query(
        `SELECT * FROM booked_seats WHERE movie_id=? AND seat_code=?`,
        [movieId, newSeat],
        (err, result) => {
            if (err) return res.status(500).json({ error: "DB error" })

            if (result.length > 0) {
                return res.status(400).json({ message: "Seat already booked" })
            }

            // Update seat
            con.query(
                `UPDATE booked_seats SET seat_code=? WHERE movie_id=? AND seat_code=?`,
                [newSeat, movieId, oldSeat],
                (err) => {
                    if (err) {
                        console.error("Error updating seat:", err)
                        return res.status(500).json({ error: "Error updating seat" })
                    }
                    console.log(`Seat updated from ${oldSeat} to ${newSeat}`)
                    res.json({ success: true })
                }
            )
        }
    )
})

// Start server
app.listen(port, () => {
    console.log('Server is running on ' + port)
})
