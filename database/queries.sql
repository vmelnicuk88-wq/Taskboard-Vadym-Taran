-- 10 przykładowych zapytań SQL do TaskBoard.
-- Uwaga: lista dokładnych zapytań z PDF poniedziałkowego nie była dołączona;
-- poniższe przykłady przygotowano na podstawie diagramu ERD i tabel projektu.

-- 1. Lista aktywnych tablic.
SELECT id, name, description, ownerId FROM boards WHERE isDeleted = 0;

-- 2. Tablice konkretnego użytkownika.
SELECT id, name, createdAt FROM boards WHERE ownerId = 1 AND isDeleted = 0;

-- 3. Wszystkie aktywne zadania.
SELECT id, title, status, priority, deadline FROM tasks WHERE isDeleted = 0;

-- 4. Zadania wybranej tablicy.
SELECT id, title, status, priority FROM tasks WHERE boardId = 1 AND isDeleted = 0;

-- 5. Zadania oczekujące.
SELECT id, title, priority FROM tasks WHERE status = 'todo' AND isDeleted = 0;

-- 6. Zadania w trakcie.
SELECT id, title, deadline FROM tasks WHERE status = 'in_progress' AND isDeleted = 0;

-- 7. Zadania ukończone.
SELECT id, title FROM tasks WHERE status = 'done' AND isDeleted = 0;

-- 8. Zadania o wysokim priorytecie.
SELECT id, title, status FROM tasks WHERE priority = 'high' AND isDeleted = 0;

-- 9. Zadania przypisane do użytkownika wraz z nazwą tablicy.
SELECT t.id, t.title, b.name AS boardName
FROM tasks t
JOIN boards b ON b.id = t.boardId
WHERE t.assigneeId = 1 AND t.isDeleted = 0 AND b.isDeleted = 0;

-- 10. Liczba aktywnych zadań w każdym statusie.
SELECT status, COUNT(*) AS liczba
FROM tasks
WHERE isDeleted = 0
GROUP BY status;
