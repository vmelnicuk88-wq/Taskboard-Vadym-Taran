# Baza danych TaskBoard

Baza MySQL 8+ ma tabele `users`, `boards` i `tasks` oraz klucze obce
zgodne z `materialy/erd.md`. Nazwy pól odpowiadają `docs/dane.md`.

## Przygotowanie od zera

**Uwaga: skrypt usuwa istniejącą bazę `taskboard` wraz z danymi.**
Uruchamiaj go tylko na lokalnej bazie ćwiczeniowej:

~~~sh
mysql -u root -p < database/taskboard.sql
mysql -u root -p < database/konta.sql
~~~

`taskboard.sql` odtwarza schemat i dane z `materialy/users.csv`:
5 użytkowników, 2 tablice i 10 zadań (2 usunięte miękko, z czego jedno
ponad 30 dni temu). Testowe hasło z CSV to `Test1234!`, wyłącznie lokalnie.
`konta.sql` tworzy trzy konta MySQL i uprawnienia: aplikacja
`SELECT, INSERT, UPDATE` (bez `DELETE`), podgląd `SELECT`, administrator
uprawnienia administracyjne do bazy. **Zmień placeholdery haseł** przed użyciem.

`queries.sql` zawiera 10 podpisanych zapytań SQL.

## Backup i odtworzenie

Plik `backup/taskboard-2026-11-21.sql` jest odtwarzalnym zrzutem
**przykładowej struktury i danych**, a nie dumpem wykonanym na żywej bazie.
Zrzut rzeczywistej bazy wykonaj osobno:

~~~sh
mysqldump -u root -p --databases taskboard > database/backup/taskboard-live.sql
~~~

Porównaj liczbę rekordów przed odtworzeniem i po odtworzeniu:

~~~sql
SELECT 'users' AS tabela, COUNT(*) AS liczba FROM taskboard.users
UNION ALL SELECT 'boards', COUNT(*) FROM taskboard.boards
UNION ALL SELECT 'tasks', COUNT(*) FROM taskboard.tasks;
~~~

Na bazie szkoleniowej oczekiwane wartości to `5 / 2 / 10`.
Odtwórz do osobnej lokalnej instancji albo po wykonaniu kopii aktualnych
danych poleceniem `mysql -u root -p < database/backup/taskboard-2026-11-21.sql`,
a następnie powtórz zapytanie i porównaj wyniki. Odtworzenia na rzeczywistym
MySQL nie zweryfikowano automatycznie w tym repozytorium.
