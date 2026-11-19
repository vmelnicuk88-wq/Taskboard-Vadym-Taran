# TB-3: Raport przypadków testowych

Poniższe przypadki obejmują API i interfejs. Wynik „Do wykonania” oznacza, że nie przeprowadzono jeszcze testu z działającym serwerem MySQL i przeglądarką; nie należy zapisywać go jako zaliczonego bez sprawdzenia.

| ID | Scenariusz | Kroki | Oczekiwany wynik | Wynik |
| --- | --- | --- | --- | --- |
| T-01 | Zdrowie serwera | GET /api/health | 200, ok=true | Do wykonania lokalnie |
| T-02 | Tablice bez sesji | GET /api/boards bez logowania | 401 | Do wykonania lokalnie |
| T-03 | Błędne hasło | POST /api/auth/login z nieprawidłowym hasłem | 401, komunikat | Do wykonania lokalnie |
| T-04 | Poprawne logowanie | POST /api/auth/login konta testowego | 200, dane bez hasła | Do wykonania lokalnie |
| T-05 | Zajęty login | POST /api/auth/register na istniejący login | 409 | Do wykonania lokalnie |
| T-06 | Pusty tytuł | POST /api/tasks bez tytułu | 400 | Do wykonania lokalnie |
| T-07 | Błędny priorytet | GET /api/boards/1/tasks?priority=pilne | 400 | Do wykonania lokalnie |
| T-08 | Błędna osoba | GET /api/boards/1/tasks?assigneeId=abc | 400 | Do wykonania lokalnie |
| T-09 | Wszystkie filtry | GET /api/boards/1/tasks?priority=high&assigneeId=2&q=api | 200, wynik zgodny z 3 filtrami | Do wykonania lokalnie |
| T-10 | Nieistniejące zadanie | PUT /api/tasks/999999 | 404 | Do wykonania lokalnie |
| T-11 | Wylogowanie | POST /api/auth/logout, potem GET /api/auth/me | 204, następnie 401 | Do wykonania lokalnie |
| T-12 | Rejestracja w UI | Na login.html wybierz rejestrację i podaj złe dane | is-invalid i komunikat | Do wykonania w przeglądarce |
| T-13 | Edycja tablicy | Utwórz, edytuj i usuń tablicę | Dane zmienione, usuwanie po potwierdzeniu | Do wykonania w przeglądarce |
| T-14 | Edycja zadania | Utwórz zadanie, otwórz szczegóły, edytuj | Modal i aktualizacja listy | Do wykonania w przeglądarce |
| T-15 | Status i usuwanie | Zmień status zadania, potem usuń | Karta przechodzi do kolumny, znika po potwierdzeniu | Do wykonania w przeglądarce |
| T-16 | Filtry w UI | Zmień priorytet, osobę, wpisz tytuł, wyczyść | Łączne filtrowanie i przywrócenie wszystkich | Do wykonania w przeglądarce |
| T-17 | Ochrona stron | Otwórz boards.html i board.html w nowej sesji | Przejście na login.html | Do wykonania w przeglądarce |
| T-18 | Telefon i dostępność | DevTools mobile, Lighthouse i W3C na trzech stronach | Kolumny pionowo, Accessibility ≥ 90, HTML bez błędów | Nie zmierzono |

## Testy automatyczne

Plik backend/tests/taskFilters.test.js sprawdza budowanie zapytań, poprawne filtry łączone, nieprawidłowe identyfikatory i limit długości. Uruchom w katalogu backend polecenie npm test; test jest także w GitHub Actions. Wynik w workflow stanowi potwierdzenie wyłącznie tej części logiki, nie całej aplikacji.

## Miejsce na wyniki pomiarów

- Lighthouse login.html: nie zmierzono.
- Lighthouse boards.html: nie zmierzono.
- Lighthouse board.html: nie zmierzono.
- W3C login.html: nie sprawdzono.
- W3C boards.html: nie sprawdzono.
- W3C board.html: nie sprawdzono.
- Czysty klon i uruchomienie z MySQL: nie sprawdzono w tym środowisku.
