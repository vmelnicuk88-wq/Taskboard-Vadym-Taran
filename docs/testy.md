# TB-3: Raport przypadków testowych

Poniższe przypadki obejmują API i interfejs. Status „Zgodny (test API w CI)” oznacza wynik uzyskany w automatycznym teście z MySQL 8 na GitHub Actions. Status „Do wykonania” dotyczy testów przeglądarkowych, których nie przeprowadzono w CI.

| ID | Scenariusz | Kroki | Oczekiwany wynik | Wynik |
| --- | --- | --- | --- | --- |
| T-01 | Zdrowie serwera | GET /api/health | 200, ok=true | Zgodny (test API w CI) |
| T-02 | Tablice bez sesji | GET /api/boards bez logowania | 401 | Zgodny (test API w CI) |
| T-03 | Błędne hasło | POST /api/auth/login z nieprawidłowym hasłem | 401, komunikat | Zgodny (test API w CI) |
| T-04 | Poprawne logowanie | POST /api/auth/login konta testowego | 200, dane bez hasła | Zgodny (test API w CI) |
| T-05 | Zajęty login | POST /api/auth/register na istniejący login | 409 | Zgodny (test API w CI) |
| T-06 | Pusty tytuł | POST /api/tasks bez tytułu | 400 | Zgodny (test API w CI) |
| T-07 | Błędny priorytet | GET /api/boards/1/tasks?priority=pilne | 400 | Zgodny (test API w CI) |
| T-08 | Błędna osoba | GET /api/boards/1/tasks?assigneeId=abc | 400 | Zgodny (test API w CI) |
| T-09 | Wszystkie filtry | GET /api/boards/1/tasks?priority=high&assigneeId=2&q=api | 200, wynik zgodny z 3 filtrami | Zgodny (test API w CI) |
| T-10 | Nieistniejące zadanie | PUT /api/tasks/999999 | 404 | Zgodny (test API w CI) |
| T-11 | Wylogowanie | POST /api/auth/logout, potem GET /api/auth/me | 204, następnie 401 | Zgodny (test API w CI) |
| T-19 | Nieistniejący assigneeId | POST /api/tasks z assigneeId=999999 | 400 | Scenariusz dodany do testu API w CI |
| T-20 | Błędny deadline | POST i PUT /api/tasks z datą 2026-02-31 | 400 | Scenariusz dodany do testu API w CI |
| T-21 | PUT na nieistniejącą tablicę | PUT /api/tasks/:id z boardId=999999 | 404 | Scenariusz dodany do testu API w CI |
| T-12 | Rejestracja w UI | Na login.html wybierz rejestrację i podaj złe dane | is-invalid i komunikat | Do wykonania w przeglądarce |
| T-13 | Edycja tablicy | Utwórz, edytuj i usuń tablicę | Dane zmienione, usuwanie po potwierdzeniu | Do wykonania w przeglądarce |
| T-14 | Edycja zadania | Utwórz zadanie, otwórz szczegóły, edytuj | Modal i aktualizacja listy | Do wykonania w przeglądarce |
| T-15 | Status i usuwanie | Zmień status zadania, potem usuń | Karta przechodzi do kolumny, znika po potwierdzeniu | Do wykonania w przeglądarce |
| T-16 | Filtry w UI | Zmień priorytet, osobę, wpisz tytuł, wyczyść | Łączne filtrowanie i przywrócenie wszystkich | Do wykonania w przeglądarce |
| T-17 | Ochrona stron | Otwórz boards.html i board.html w nowej sesji | Przejście na login.html | Do wykonania w przeglądarce |
| T-18 | Telefon i dostępność | DevTools mobile, Lighthouse i W3C na trzech stronach | Kolumny pionowo, Accessibility ≥ 90, HTML bez błędów | Nie zmierzono |

## Testy automatyczne

Testy jednostkowe `backend/tests/taskFilters.test.js` i `backend/tests/taskValidation.test.js` sprawdzają filtrowanie oraz walidację identyfikatorów i dat. `backend/tests/integration.test.js` sprawdza rzeczywiste trasy API z MySQL 8, gdy ustawiono `TB_RUN_INTEGRATION=1`. Workflow GitHub Actions przygotowuje bazę, ustawia tę zmienną i uruchamia `npm test`. Nie oznacza to wykonania testów w przeglądarce.

## Miejsce na wyniki pomiarów

- Lighthouse login.html: nie zmierzono.
- Lighthouse boards.html: nie zmierzono.
- Lighthouse board.html: nie zmierzono.
- W3C login.html: nie sprawdzono.
- W3C boards.html: nie sprawdzono.
- W3C board.html: nie sprawdzono.
- Czysty klon i uruchomienie z MySQL: nie sprawdzono w tym środowisku.
