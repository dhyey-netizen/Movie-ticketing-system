const form = document.getElementById('form')
form.addEventListener('submit', async (e) => {
  e.preventDefault()

  const name = document.getElementById('name').value
  const email = document.getElementById('email').value
  const password = document.getElementById('password').value

  const res = await fetch('/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password })
  })

  const data = await res.json()
  alert(data.message)

  if (res.ok) {
    showSuccessPopup()
  }
})

function showSuccessPopup() {
  const popup = document.getElementById('success-popup')
  popup.style.display = 'flex'

  // Redirect after 5 seconds
  setTimeout(() => {
    window.location.href = 'index.html'
  }, 5000)
}
