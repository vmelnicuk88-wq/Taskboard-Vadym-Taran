-- Konta testowe TaskBoard. Importuj po utworzeniu tabeli users.
USE taskboard;
INSERT INTO users (login, passwordHash, firstName, lastName) VALUES
('anna.nowak', '$2a$10$qCgFwKm4Qiu60z3cTqCvz.DZUvPNVnkJQjMagc4wtx24LiYjsF./y', 'Anna', 'Nowak'),
('jan.kowalski', '$2a$10$qCgFwKm4Qiu60z3cTqCvz.DZUvPNVnkJQjMagc4wtx24LiYjsF./y', 'Jan', 'Kowalski'),
('ola.wisniewska', '$2a$10$qCgFwKm4Qiu60z3cTqCvz.DZUvPNVnkJQjMagc4wtx24LiYjsF./y', 'Ola', 'Wiśniewska'),
('piotr.zielinski', '$2a$10$qCgFwKm4Qiu60z3cTqCvz.DZUvPNVnkJQjMagc4wtx24LiYjsF./y', 'Piotr', 'Zieliński'),
('kasia.lewandowska', '$2a$10$qCgFwKm4Qiu60z3cTqCvz.DZUvPNVnkJQjMagc4wtx24LiYjsF./y', 'Kasia', 'Lewandowska')
ON DUPLICATE KEY UPDATE login = VALUES(login);
