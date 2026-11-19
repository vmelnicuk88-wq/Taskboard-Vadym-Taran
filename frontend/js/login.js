// Formularze logowania i rejestracji (identyfikatory z login.html).
function showAuthMessage(message, danger = true) {
  const target = document.getElementById('message');
  if (!target) return;
  target.textContent = message;
  target.className = danger ? 'alert alert-danger' : 'alert alert-success';
}
async function submitAuth(url, values) {
  const response = await fetch('/api/auth/' + url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'same-origin',
    body: JSON.stringify(values)
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Nie udało się zalogować');
  window.location.href = 'boards.html';
}
document.getElementById('loginForm')?.addEventListener('submit', async event => {
  event.preventDefault();
  try {
    await submitAuth('login', {
      login: document.getElementById('login').value.trim(),
      password: document.getElementById('password').value
    });
  } catch (error) { showAuthMessage(error.message); }
});
document.getElementById('registerForm')?.addEventListener('submit', async event => {
  event.preventDefault();
  const form = event.currentTarget;
  const data = new FormData(form);
  try {
    await submitAuth('register', {
      login: String(data.get('login') || '').trim(),
      password: String(data.get('password') || ''),
      firstName: String(data.get('firstName') || '').trim(),
      lastName: String(data.get('lastName') || '').trim()
    });
  } catch (error) { showAuthMessage(error.message); }
});
