-- Odtwarzalny przykład (schemat i dane), nie zrzut z żywej bazy.
DROP DATABASE IF EXISTS taskboard;
CREATE DATABASE taskboard CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE taskboard;

CREATE TABLE users (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  login VARCHAR(30) NOT NULL UNIQUE,
  passwordHash VARCHAR(60) NOT NULL,
  firstName VARCHAR(80) NOT NULL,
  lastName VARCHAR(80) NOT NULL,
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE boards (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(80) NOT NULL,
  description TEXT NULL,
  ownerId INT UNSIGNED NOT NULL,
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  isDeleted TINYINT(1) NOT NULL DEFAULT 0,
  deletedAt DATETIME NULL,
  deletedById INT UNSIGNED NULL,
  FOREIGN KEY (ownerId) REFERENCES users(id),
  FOREIGN KEY (deletedById) REFERENCES users(id)
) ENGINE=InnoDB;

CREATE TABLE tasks (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(100) NOT NULL,
  description TEXT NULL,
  status ENUM('todo','in_progress','done') NOT NULL DEFAULT 'todo',
  priority ENUM('low','medium','high') NOT NULL DEFAULT 'medium',
  deadline DATE NULL,
  boardId INT UNSIGNED NOT NULL,
  assigneeId INT UNSIGNED NULL,
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  isDeleted TINYINT(1) NOT NULL DEFAULT 0,
  deletedAt DATETIME NULL,
  deletedById INT UNSIGNED NULL,
  INDEX idx_tasks_filters (boardId,isDeleted,priority,assigneeId),
  FOREIGN KEY (boardId) REFERENCES boards(id),
  FOREIGN KEY (assigneeId) REFERENCES users(id),
  FOREIGN KEY (deletedById) REFERENCES users(id)
) ENGINE=InnoDB;

-- Dane szkoleniowe zgodne z materialy/users.csv (nigdy do produkcji).
INSERT INTO users (login, passwordHash, firstName, lastName) VALUES
('anna.nowak', '$2a$10$qCgFwKm4Qiu60z3cTqCvz.DZUvPNVnkJQjMagc4wtx24LiYjsF./y', 'Anna', 'Nowak'),
('jan.kowalski', '$2a$10$qCgFwKm4Qiu60z3cTqCvz.DZUvPNVnkJQjMagc4wtx24LiYjsF./y', 'Jan', 'Kowalski'),
('ola.wisniewska', '$2a$10$qCgFwKm4Qiu60z3cTqCvz.DZUvPNVnkJQjMagc4wtx24LiYjsF./y', 'Ola', 'Wiśniewska'),
('piotr.zielinski', '$2a$10$qCgFwKm4Qiu60z3cTqCvz.DZUvPNVnkJQjMagc4wtx24LiYjsF./y', 'Piotr', 'Zieliński'),
('kasia.lewandowska', '$2a$10$qCgFwKm4Qiu60z3cTqCvz.DZUvPNVnkJQjMagc4wtx24LiYjsF./y', 'Kasia', 'Lewandowska');

INSERT INTO boards (name, description, ownerId) VALUES
('Aplikacja TaskBoard', 'Projektowanie i rozwój aplikacji', 1),
('Organizacja praktyk', 'Zadania na praktykach', 2);

-- 10 rekordów, różne statusy i priorytety, 2 soft delete.
-- Jeden rekord usunięto ponad 30 dni temu.
INSERT INTO tasks
(title, description, status, priority, deadline, boardId, assigneeId, isDeleted, deletedAt, deletedById)
VALUES
('Przygotować makietę', 'Ekran tablicy', 'todo', 'high', '2026-11-30', 1, 1, 0, NULL, NULL),
('Opisać API', 'Dodać dokumentację endpointów', 'in_progress', 'medium', '2026-11-28', 1, 2, 0, NULL, NULL),
('Sprawdzić formularz', NULL, 'done', 'low', '2026-11-10', 1, 3, 0, NULL, NULL),
('Poprawić README', NULL, 'todo', 'low', NULL, 1, 4, 0, NULL, NULL),
('Przygotować bazę', NULL, 'in_progress', 'high', '2026-11-25', 1, 1, 0, NULL, NULL),
('Dodać walidację', NULL, 'todo', 'medium', '2026-12-03', 2, 2, 0, NULL, NULL),
('Przetestować endpointy', NULL, 'done', 'high', '2026-11-18', 2, 3, 0, NULL, NULL),
('Uzupełnić dokumentację', NULL, 'in_progress', 'low', NULL, 2, 4, 0, NULL, NULL),
('Stare zadanie testowe', NULL, 'done', 'medium', NULL, 1, 5, 1, '2026-09-30 12:00:00', 1),
('Nieaktualny wpis', NULL, 'todo', 'low', NULL, 2, NULL, 1, '2026-11-20 12:00:00', 2);
