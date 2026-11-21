# Dane aplikacji TaskBoard

Poniżej są rzeczywiste nazwy pól w schemacie `database/taskboard.sql`.

## Użytkownik: `users`

| Pole | Typ i znaczenie |
| --- | --- |
| `id` | INT UNSIGNED, klucz główny |
| `login` | VARCHAR(30), unikalny |
| `passwordHash` | VARCHAR(60), hash bcrypt |
| `firstName` | VARCHAR(80), imię |
| `lastName` | VARCHAR(80), nazwisko |
| `createdAt` | DATETIME, data utworzenia |

## Tablica: `boards`

| Pole | Typ i znaczenie |
| --- | --- |
| `id` | Klucz główny |
| `name` | VARCHAR(80), nazwa |
| `description` | TEXT, opcjonalny opis |
| `ownerId` | Klucz obcy do `users.id` |
| `createdAt` | Data utworzenia |
| `isDeleted` | 0 lub 1, miękkie usunięcie |
| `deletedAt` | Data usunięcia lub NULL |
| `deletedById` | Klucz obcy do użytkownika lub NULL |

## Zadanie: `tasks`

| Pole | Typ i znaczenie |
| --- | --- |
| `id` | Klucz główny |
| `title` | VARCHAR(100), tytuł |
| `description` | TEXT lub NULL |
| `status` | `todo`, `in_progress`, `done` |
| `priority` | `low`, `medium`, `high` |
| `deadline` | DATE lub NULL (nie `dueDate`) |
| `boardId` | Klucz obcy do `boards.id` |
| `assigneeId` | Klucz obcy do `users.id` lub NULL |
| `createdAt` | Data utworzenia |
| `isDeleted` | 0 lub 1 (nie `deleted`) |
| `deletedAt` | Data usunięcia lub NULL |
| `deletedById` | Klucz obcy do użytkownika lub NULL |

Każdy użytkownik może mieć wiele tablic i przypisanych zadań.
Zadanie należy do jednej tablicy; przypisanie osoby jest opcjonalne.
Aplikacja usuwa rekordy miękko przez zmianę `isDeleted`.

## Przykładowy JSON zadania

~~~json
{
  "id": 7,
  "title": "Uzupełnić README",
  "description": "Dodać instrukcję uruchomienia",
  "status": "in_progress",
  "priority": "high",
  "deadline": "2026-11-30",
  "boardId": 2,
  "assigneeId": 1,
  "isDeleted": 0
}
~~~

API szczegółów zadania nie zwraca pól usunięcia; powyższy JSON
przedstawia przykładowy rekord w bazie danych.

## Diagram ERD

~~~mermaid
erDiagram
    users ||--o{ boards : "tworzy"
    boards ||--o{ tasks : "zawiera"
    users |o--o{ tasks : "przypisany do"

    users {
        int id PK
        string login
        string passwordHash
        string firstName
        string lastName
        datetime createdAt
    }
    boards {
        int id PK
        string name
        string description
        int ownerId FK
        datetime createdAt
        boolean isDeleted
        datetime deletedAt
        int deletedById FK
    }
    tasks {
        int id PK
        string title
        string description
        string status
        string priority
        date deadline
        int boardId FK
        int assigneeId FK
        datetime createdAt
        boolean isDeleted
        datetime deletedAt
        int deletedById FK
    }
~~~
