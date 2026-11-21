# Zadanie TB-2

## Część 1: tabela zadań i zapytania SQL

- Utworzyć tabelę `tasks` według diagramu ERD, z kluczami obcymi, dozwolonymi wartościami `status` i `priority oraz polami soft delete.
- Dodać 10 zadań testowych o różnych statusach i priorytetach, w tym 1–2 rekordy usunięte miękko.
- Przygotować 10 zapytań SQL w `database/queries.sql`.
- Wykonać kopię zapasową w `database/backup/`, odtworzyć ją w bazie `taskboard_test` i porównać liczbę rekordów.

## Część 2: API zadań

- Utworzyć `backend/routes/tasks.js` na wzór `backend/routes/boards.js` i podłączyć `/api/tasks` w `backend/server.js`.
- Dodać `GET /api/boards/:boardId/tasks`, `GET /api/tasks/:id`, `POST /api/tasks`, `PUT /api/tasks/:id` i `DELETE /api/tasks/:id`.
- Utworzyć `backend/routes/users.js` z `GET /api/users`; zwracać wyłącznie `id`, `login`, `firstName`, `lastName`.
- Walidować tytuł (3–100 znaków), status, priorytet, termin, istniejącą aktywną tablicę i opcjonalnego użytkownika.
- Usuwanie zadania realizować jako soft delete przez `isDeleted = 1` i `deletedAt`; `deletedById` pozostaje puste.
- Rozbudować kolekcję Postman w `docs/postman/`, uwzględniając przypadki 400 i 404.
- Dopisać do README sekcję „Baza danych”.

## Kryteria sprawdzenia

- Aktywne zadania zwracają 200; brakująca lub usunięta tablica — 404.
- Nieprawidłowe dane POST/PUT zwracają 400; brakujące zadanie — 404.
- POST zwraca 201, DELETE — 204.
- Soft-deleted zadania nie pojawiają się na listach i pozostają w bazie.
- `GET /api/users` nie ujawnia `passwordHash`.
