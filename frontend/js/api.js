// Wspólna funkcja do zapytań API.
async function api(path, method = 'GET', body) {
  const res = await fetch('/api' + path, {
    method,
    credentials: 'same-origin',
    headers: body === undefined ? {} : { 'Content-Type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body)
  });
  if (res.status === 401) {
    window.location.href = 'login.html';
    throw new Error('Zaloguj się, aby kontynuować');
  }
  const data = res.status === 204 ? null : await res.json();
  if (!res.ok) throw new Error(data?.error || 'Błąd serwera');
  return data;
}
async function currentUser() {
  return api('/auth/me');
}
async function logout() {
  await api('/auth/logout', 'POST');
  window.location.href = 'login.html';
}
