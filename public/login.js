let form = document.getElementById('login')
form.addEventListener('submit', async function (event) {
    event.preventDefault()

    const email = document.getElementById('email').value
    const password = document.getElementById('password').value

    const response = await fetch('http://localhost:8000/api/users')
    const usrData = await response.json()

    usrData.find((data) => {
        if (data.email === email && data.password === password) {
            alert('Successfully Logged In')
            window.location.href = `index.html?status=ok&id=${data.id}&email=${data.email}&password=${data.password}`
        }
    })
})