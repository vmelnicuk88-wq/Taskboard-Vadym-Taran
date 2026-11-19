# Dokumentacja API TaskBoard

Adres bazowy: http://localhost:3000/api. Żądania i odpowiedzi danych mają format JSON. Serwer używa ciasteczka sesji, które przeglądarka przekazuje automatycznie. Wszystkie trasy oprócz health i auth/login oraz auth/register wymagają logowania.

## Trasy API

| Metoda | Adres | Działanie | Odpowiedzi |
| --- | --- | --- | --- |
| GET | /api/health | Stan serwera | 200 |
| POST | /api/auth/register | Rejestracja i rozpoczęcie sesji | 201, 400, 409 |
| POST | /api/auth/login | Logowanie | 200, 400, 401 |
| POST | /api/auth/logout | Wylogowanie | 204 |
| GET | /api/auth/me | Dane zalogowanego użytkownika | 200, 401 |
| GET | /api/users | Lista użytkowników do przypisywania | 200, 401 |
| GET | /api/boards | Lista aktywnych tablic | 200, 401 |
| GET | /api/boards/:id | Szczegóły tablicy | 200, 401, 404 |
| POST | /api/boards | Dodanie tablicy | 201, 400, 401 |
| PUT | /api/boards/:id | Edycja nazwy i opisu | 200, 400, 401, 404 |
| DELETE | /api/boards/:id | Miękkie usunięcie tablicy | 204, 401, 404 |
| GET | /api/boards/:boardId/tasks | Zadania tablicy i filtry | 200, 400, 401, 404 |
| GET | /api/tasks/:id | Szczegóły zadania | 200, 401, 404 |
| POST | /api/tasks | Utworzenie zadania | 201, 400, 401, 404 |
| PUT | /api/tasks/:id | Edycja zadania lub zmiana statusu | 200, 400, 401, 404 |
| DELETE | /api/tasks/:id | Miękkie usunięcie zadania | 204, 401, 404 |

W przypadku nieoczekiwanego błędu serwera możliwa jest odpowiedź 500. Błędy mają format JSON z polem error.

## Parametry filtrów

GET /api/boards/:boardId/tasks przyjmuje opcjonalne parametry:

- priority: low, medium lub high; inne wartości powodują HTTP 400.
- assigneeId: dodatnia liczba całkowita (identyfikator użytkownika); inne wartości powodują HTTP 400.
- q: fragment tytułu, maksymalnie 100 znaków, wyszukiwany przez SQL LIKE.
- Parametry można łączyć, na przykład: /api/boards/1/tasks?priority=high&assigneeId=2&q=API.

Zwracane są tylko aktywne zadania danej aktywnej tablicy, bez usuniętych rekordów.

## Przykłady JSON

Żądanie rejestracji:

~~~json
{
  "login": "nowy.uczen",
  "password": "mocneHaslo123",
  "firstName": "Ala",
  "lastName": "Nowak"
}
~~~

Żądanie utworzenia tablicy:

~~~json
{
  "name": "Projekt szkolny",
  "description": "Zadania zespołu"
}
~~~

Żądanie POST /api/tasks i PUT /api/tasks/:id (przy edycji pola zadania pozostają w żądaniu):

~~~json
{
  "boardId": 1,
  "title": "Przetestować API",
  "description": "Sprawdzić odpowiedzi",
  "status": "todo",
  "priority": "high",
  "deadline": "2026-11-30",
  "assigneeId": 2
}
~~~

Przykładowa odpowiedź GET /api/boards/1/tasks:

~~~json
[
  {
    "id": 5,
    "title": "Przetestować API",
    "status": "todo",
    "priority": "high",
    "deadline": "2026-11-30",
    "assigneeId": 2
  }
]
~~~

Przykładowy błąd walidacji HTTP 400:

~~~json
{ "error": "Nieprawidłowa osoba" }
~~~

## Soft delete

Usuwanie tablic i zadań oznacza rekord przez isDeleted=1 oraz zapisuje deletedAt i deletedById. Aktywne listy nie pokazują usuniętych rekordów; rekordy pozostają w bazie.
