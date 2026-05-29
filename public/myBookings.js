async function fetchBookings() {
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();

    if (!email || !password) {
        alert('Please enter both email and password.');
        return;
    }

    const response = await fetch('/api/myBookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });

    const data = await response.json();
    const bookingsDiv = document.getElementById('bookings');
    bookingsDiv.innerHTML = '';

    if (data.length === 0 || data.error) {
        bookingsDiv.innerHTML = `<p class="no-bookings">No bookings found.</p>`;
        return;
    }

    data.forEach(b => {
        const div = document.createElement('div');
        div.className = 'booking';
        div.textContent = `🎬 Movie ID: ${b.movie_id} | Seat: ${b.seat_code} | Date: ${b.booking_date}`;
        div.dataset.id = b.id;

        // Double-click to delete
        div.addEventListener('dblclick', async () => {
            if (confirm(`Delete booking for seat ${b.seat_code}?`)) {
                const res = await fetch(`/api/deleteBooking/${b.id}`, { method: 'DELETE' });
                const result = await res.json();
                if (result.message) {
                    alert(result.message);
                } else if (result.error) {
                    alert("❌ " + result.error);
                } else {
                    alert("Unexpected response. Check console.");
                    console.log(result);
                }
                fetchBookings(); // refresh list
            }
        });

        bookingsDiv.appendChild(div);
    });
}
