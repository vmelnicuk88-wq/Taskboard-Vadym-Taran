-- TaskBoard: struktura bazy danych i dane testowe
-- Importuj w phpMyAdmin do MySQL/MariaDB (XAMPP).
CREATE DATABASE IF NOT EXISTS taskboard
  CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE taskboard;

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS tasks;
DROP TABLE IF EXISTS boards;
DROP TABLE IF EXISTS users;
SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE users (
  id INT NOT NULL AUTO_INCREMENT,
  login VARCHAR(30) NOT NULL,
  passwordHash CHAR(60) NOT NULL,
  firstName VARCHAR(50) NOT NULL,
  lastName VARCHAR(50) NOT NULL,
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_users_login (login)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE boards (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(80) NOT NULL,
  description VARCHAR(255) DEFAULT NULL,
  ownerId INT NOT NULL,
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  isDeleted TINYINT(1) NOT NULL DEFAULT 0,
  deletedAt DATETIME DEFAULT NULL,
  deletedById INT DEFAULT NULL,
  PRIMARY KEY (id),
  KEY idx_boards_ownerId (ownerId),
  KEY idx_boards_deletedById (deletedById),
  CONSTRAINT fk_boards_owner FOREIGN KEY (ownerId) REFERENCES users (id),
  CONSTRAINT fk_boards_deletedBy FOREIGN KEY (deletedById) REFERENCES users (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE tasks (
  id INT NOT NULL AUTO_INCREMENT,
  title VARCHAR(100) NOT NULL,
  description TEXT DEFAULT NULL,
  status ENUM('todo', 'in_progress', 'done') NOT NULL DEFAULT 'todo',
  priority ENUM('low', 'medium', 'high') NOT NULL DEFAULT 'medium',
  deadline DATE DEFAULT NULL,
  boardId INT NOT NULL,
  assigneeId INT DEFAULT NULL,
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  isDeleted TINYINT(1) NOT NULL DEFAULT 0,
  deletedAt DATETIME DEFAULT NULL,
  deletedById INT DEFAULT NULL,
  PRIMARY KEY (id),
  KEY idx_tasks_boardId (boardId),
  KEY idx_tasks_assigneeId (assigneeId),
  KEY idx_tasks_deletedById (deletedById),
  CONSTRAINT fk_tasks_board FOREIGN KEY (boardId) REFERENCES boards (id),
  CONSTRAINT fk_tasks_assignee FOREIGN KEY (assigneeId) REFERENCES users (id),
  CONSTRAINT fk_tasks_deletedBy FOREIGN KEY (deletedById) REFERENCES users (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Testowe konta; hasła przechowywane wyłącznie jako hash bcrypt.
INSERT INTO users (id, login, passwordHash, firstName, lastName) VALUES
(1, 'anna.nowak', '$2a$10$qCgFwKm4Qiu60z3cTqCvz.DZUvPNVnkJQjMagc4wtx24LiYjsF./y', 'Anna', 'Nowak'),
(2, 'jan.kowalski', '$2a$10$qCgFwKm4Qiu60z3cTqCvz.DZUvPNVnkJQjMagc4wtx24LiYjsF./y', 'Jan', 'Kowalski'),
(3, 'ola.wisniewska', '$2a$10$qCgFwKm4Qiu60z3cTqCvz.DZUvPNVnkJQjMagc4wtx24LiYjsF./y', 'Ola', 'Wiśniewska'),
(4, 'piotr.zielinski', '$2a$10$qCgFwKm4Qiu60z3cTqCvz.DZUvPNVnkJQjMagc4wtx24LiYjsF./y', 'Piotr', 'Zieliński'),
(5, 'kasia.lewandowska', '$2a$10$qCgFwKm4Qiu60z3cTqCvz.DZUvPNVnkJQjMagc4wtx24LiYjsF./y', 'Kasia', 'Lewandowska');

INSERT INTO boards (id, name, description, ownerId, isDeleted, deletedAt, deletedById) VALUES
(1, 'Aplikacja TaskBoard', 'Tablica do rozwoju aplikacji', 1, 0, NULL, NULL),
(2, 'Organizacja praktyk', 'Zadania związane z praktykami', 2, 0, NULL, NULL);

-- 10 zadań testowych: różne statusy i priorytety; dwa rekordy soft delete.
INSERT INTO tasks (id, title, description, status, priority, deadline, boardId, assigneeId, isDeleted, deletedAt) VALUES
(1, 'Przygotować makietę', 'Uzupełnić widok tablicy', 'todo', 'high', '2026-11-14', 1, 1, 0, NULL),
(2, 'Opisać API', 'Dodać opis tras', 'in_progress', 'medium', '2026-11-15', 1, 2, 0, NULL),
(3, 'Sprawdzić formularz', NULL, 'done', 'low', '2026-11-09', 1, 3, 0, NULL),
(4, 'Poprawić README', NULL, 'todo', 'low', NULL, 1, 4, 0, NULL),
(5, 'Przygotować bazę', NULL, 'in_progress', 'high', '2026-11-13', 1, 1, 0, NULL),
(6, 'Dodać walidację', NULL, 'todo', 'medium', '2026-11-16', 2, 2, 0, NULL),
(7, 'Przetestować endpointy', NULL, 'done', 'high', '2026-11-10', 2, 3, 0, NULL),
(8, 'Zaktualizować dokumentację', NULL, 'in_progress', 'low', NULL, 2, 4, 0, NULL),
(9, 'Stare zadanie testowe', NULL, 'done', 'medium', NULL, 1, 5, 1, CURRENT_TIMESTAMP),
(10, 'Nieaktualny wpis', NULL, 'todo', 'low', NULL, 2, NULL, 1, CURRENT_TIMESTAMP);

ALTER TABLE users AUTO_INCREMENT = 6;
ALTER TABLE boards AUTO_INCREMENT = 3;
ALTER TABLE tasks AUTO_INCREMENT = 11;
