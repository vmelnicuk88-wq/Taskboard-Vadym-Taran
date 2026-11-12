# Baza danych

Baza TaskBoard używa MySQL/MariaDB i kodowania `utf8mb4`.

## Tabele i relacje

| Tabela | Przeznaczenie |
| --- | --- |
| `users` | Użytkownicy, unikalny login i hash bcrypt hasła. |
| `boards` | Tablice i ich właściciele. |
| `tasks` | Zadania, statusy, priorytety, terminy i przypisania. |

- `boards.ownerId` → `users.id` (jeden użytkownik może mieć wiele tablic).
- `tasks.boardId` → `boards.id` (jedna tablica ma wiele zadań).
- `tasks.assigneeId` → `users.id` (opcjonalny przypisany użytkownik).
- `boards.deletedById` i `tasks.deletedById` → `users.id`.

## Soft delete

Rekord nie jest fizycznie kasowany. Przy usunięciu ustawiane są
`isDeleted = 1` i `deletedAt = NOW()`. Aktywne listy filtrują
`isDeleted = 0`. W API TB-2 `deletedById` pozostaje `NULL`.

## Import i kopia zapasowa

1. Uruchom MySQL w XAMPP i otwórz phpMyAdmin.
2. Zaimportuj `database/taskboard.sql`. Skrypt tworzy bazę `taskboard`,
   tabele i 10 testowych zadań (w tym 2 soft delete).
3. Opcjonalny plik `database/konta.sql` dodaje konta testowe.
4. Kopia zapasowa znajduje się w `database/backup/taskboard.sql`.
5. Do testu odtworzenia utwórz `taskboard_test`, zmień nazwę bazy w kopii
   na `taskboard_test`, zaimportuj i porównaj liczbę rekordów w trzech tabelach.

Dokładny wynik testu importu trzeba sprawdzić lokalnie w phpMyAdmin.

