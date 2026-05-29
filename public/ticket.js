window.onload = function () {
    const booking = JSON.parse(localStorage.getItem("ticketData"));

    if (!booking) {
        document.getElementById("ticketDetails").innerHTML = "No ticket found!";
        return;
    }

    const { email, movie_id, selected_seats, booking_date } = booking;

    document.getElementById("ticketDetails").innerHTML = `
        Movie ID: ${movie_id}<br>
        Seats: ${selected_seats.join(", ")}<br>
        Date: ${booking_date}
    `;

    const qrData = `
Email: ${email}
Movie ID: ${movie_id}
Seats: ${selected_seats.join(", ")}
Date: ${booking_date}
    `;

    new QRCode(document.getElementById("qrcode"), qrData);
};
