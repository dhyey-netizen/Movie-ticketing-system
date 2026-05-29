var mysql = require('mysql2')

var con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'priyansh'
})

con.connect(function (err) {
    if (err) throw err
    console.log('Connected')

    con.query("create database movie_ticketing", function (err, result) {
        if (err) throw err
        console.log("Created Database")
    })
})