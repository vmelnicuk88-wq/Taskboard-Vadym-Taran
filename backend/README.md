# Backend TaskBoard

Serwer Express w `server.js` obsługuje sesje logowania i REST API:
`/api/auth`, `/api/users`, `/api/boards` i `/api/tasks`.
MySQL jest połączony przez `db.js`, a ochrona tras jest w
`middleware/auth.js`. Walidacja zadań jest w `taskValidation.js`.

## Uruchomienie

Po ustawieniu `.env` i zaimportowaniu bazy:

~~~sh
cd backend
npm ci
npm start
~~~

Serwer działa lokalnie na `http://localhost:3000`.
Testy: `npm test`; integracja z MySQL wymaga `TB_RUN_INTEGRATION=1`
i przygotowanej bazy testowej. Workflow GitHub Actions uruchamia
testy jednostkowe oraz integracyjne na MySQL 8.
Dokumentację wszystkich tras znajdziesz w `docs/api.md`.
