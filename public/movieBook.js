const urlParams = new URLSearchParams(window.location.search);
const movieId = urlParams.get('id');

console.log(movieId)

async function loadMovies() {
    const response = await fetch('/api/movies');
    const moviesData = await response.json();

    let movie = moviesData.find((m, index) => index == movieId);
    console.log("Selected Movie:", movie);

    let usr_title = document.getElementById('title')
    usr_title.innerText = movie.title
    usr_title.style.fontFamily = "Arial"
    usr_title.style.color = "rgb(51, 51, 51)"
    usr_title.style.fontWeight = "600"
    usr_title.style.fontSize = "16px"

    const date = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = date.toLocaleDateString('en-US', options);

    let usr_data = document.getElementById('date')
    usr_data.innerText = formattedDate
    usr_data.style.margin = "4px 0px 4px 0px"
    usr_data.style.fontFamily = "Arial"
    usr_data.style.fontSize = "14px"
    console.log(usr_data)

    document.getElementsByClassName('heading')[0].append(usr_title, usr_data)
}

loadMovies();

let selected_tickets = []
let totalPrice = 0

const priceByRow = {
    A: 120,
    B: 120,
    C: 180,
    D: 180,
    E: 180,
    F: 250,
    G: 250,
    H: 250
}

function ticketBooking () {
    let row = document.getElementsByClassName('row')[0]
    let ch = 65

    for (let i = 0; i < 8; i++) {
        let rowLetter = String.fromCharCode(ch);

        for (let j = 0; j < 8; j++) {
            let div = document.createElement('div')
            div.classList.add('seat')
            div.style.border = "2px solid lime"
            div.style.borderRadius = "5px"
            div.style.color = "grey"
            div.style.fontFamily = "Arial"
            div.style.fontSize = "11px"
            div.style.width = "25px"
            div.style.height = "25px"
            div.style.alignContent = "center"
            div.innerText = rowLetter + (j + 1).toString().padStart(2, '0');
            
            div.addEventListener('click', function () {
                if (div.clickTimeout) clearTimeout(div.clickTimeout)
                
                div.clickTimeout = setTimeout(() => {
                    if (!selected_tickets.includes(div.innerText)) {
                        this.style.background = "rgba(9, 135, 9, 1)"
                        this.style.border = "rgba(9, 135, 9, 1)"
                        this.style.color = "white"
                        selected_tickets.push(div.innerText)
                        totalPrice += priceByRow[rowLetter]
                        updatePriceDisplay()
                    }
                }, 200)
            })

            div.addEventListener('dblclick', function () {
                clearTimeout(div.clickTimeout); // cancel single-click timer
                let index = selected_tickets.indexOf(div.innerText)

                if (index > -1) {
                    this.style.background = "white"
                    this.style.border = "2px solid lime"
                    this.style.color = "grey"
                    selected_tickets.splice(index, 1)
                    totalPrice -= priceByRow[rowLetter]
                    updatePriceDisplay()
                }
            })

            row.append(div)
        }
        ch++
    }
}

ticketBooking()

async function disableBookedSeats () {
    const response = await fetch(`/api/bookedSeats/${movieId}`)
    const bookedSeats = await response.json()

    console.log('Booked Seats' + bookedSeats)

    const allSeats = document.getElementsByClassName('seat');
    for (let div of allSeats) {
        if (bookedSeats.includes(div.innerText)) {
            div.style.background = "gray";
            div.style.border = "2px solid gray";
            div.style.color = "white";
            div.style.pointerEvents = "none";
        }
    }
}

disableBookedSeats()

let priceInfo = document.createElement('div')
priceInfo.setAttribute('id', 'price-info')

function updatePriceDisplay() {
    let priceBox = document.getElementById('price-box')

    priceInfo.innerHTML = `Pay ₹${totalPrice}` 
    priceBox.append(priceInfo)   
}

function submit() {
  if (selected_tickets.length === 0) {
    alert("Please select at least one seat before booking!");
    return;
  }

  const popupOverlay = document.getElementById('popup-overlay');
  popupOverlay.style.display = 'flex';

  document.getElementById('cancel-btn').addEventListener('click', () => {
    popupOverlay.style.display = 'none';
  });

  document.getElementById('booking-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();

    if (!email || !password) {
      alert("Please fill out all fields!");
      return;
    }

    // Hide booking popup
    popupOverlay.style.display = 'none';

    // Show fake payment popup
    const paymentOverlay = document.getElementById('payment-overlay');
    const paymentAmount = document.getElementById('payment-amount');
    paymentAmount.innerText = `Amount to Pay: ₹${totalPrice}`;
    paymentOverlay.style.display = 'flex';

    document.getElementById('cancel-payment').addEventListener('click', () => {
      paymentOverlay.style.display = 'none';
    });

    document.getElementById('pay-now').addEventListener('click', async () => {
      const cardNumber = document.getElementById('card-number').value.trim();
      const expiry = document.getElementById('expiry').value.trim();
      const cvv = document.getElementById('cvv').value.trim();

      if (!cardNumber || !expiry || !cvv) {
        alert("Please fill all payment details!");
        return;
      }

      // Fake payment delay
      alert("Processing Payment...");
      await new Promise(resolve => setTimeout(resolve, 1500));
      alert("Payment Successful ✅");

      paymentOverlay.style.display = 'none';

      // Continue to book seats
      const res = await fetch('/api/sendData');
      const usrData = await res.json();

      const date = new Date();
      const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

      const bookingData = {
        user_id: usrData.id,
        movie_id: Number(movieId),
        booking_date: formattedDate,
        quantity: selected_tickets.length,
        total_price: totalPrice,
        selected_seats: selected_tickets
      };

      const response = await fetch('/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData)
      });

      alert(`Booking Confirmed!\n\nSeats: ${selected_tickets.join(', ')}\nTotal: ₹${totalPrice}`);

      // Disable booked seats
      selected_tickets.forEach((seatno) => {
        let seatdiv = document.getElementsByClassName('seat');
        for (let div of seatdiv) {
          if (div.innerText === seatno) {
            div.style.background = "grey";
            div.style.border = "2px solid grey";
            div.style.color = "white";
            div.style.pointerEvents = "none";
          }
        }
      });

      // Reset after booking
      selected_tickets = [];
      totalPrice = 0;
      updatePriceDisplay();
    });
  });
}

selected_tickets = [];
totalPrice = 0;
updatePriceDisplay();