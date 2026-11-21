-- Konta serwera MySQL. Uruchom jako administrator, po utworzeniu bazy.
-- Hasła poniżej są WYŁĄCZNIE placeholderami do lokalnych ćwiczeń:
-- koniecznie zmień je przed użyciem i nigdy nie publikuj prawdziwych haseł.
CREATE USER IF NOT EXISTS 'taskboard_app'@'127.0.0.1'
  IDENTIFIED BY 'ZMIEN_HASLO_APLIKACJI';
CREATE USER IF NOT EXISTS 'taskboard_viewer'@'127.0.0.1'
  IDENTIFIED BY 'ZMIEN_HASLO_PODGLADU';
CREATE USER IF NOT EXISTS 'taskboard_admin'@'127.0.0.1'
  IDENTIFIED BY 'ZMIEN_HASLO_ADMINA';

-- REVOKE usuwa starsze uprawnienia, w tym DELETE, jeśli konto już istniało.
REVOKE ALL PRIVILEGES, GRANT OPTION FROM 'taskboard_app'@'127.0.0.1';
REVOKE ALL PRIVILEGES, GRANT OPTION FROM 'taskboard_viewer'@'127.0.0.1';
REVOKE ALL PRIVILEGES, GRANT OPTION FROM 'taskboard_admin'@'127.0.0.1';

GRANT SELECT, INSERT, UPDATE ON taskboard.* TO 'taskboard_app'@'127.0.0.1';
GRANT SELECT ON taskboard.* TO 'taskboard_viewer'@'127.0.0.1';
GRANT SELECT, INSERT, UPDATE, DELETE, CREATE, ALTER, INDEX, DROP
  ON taskboard.* TO 'taskboard_admin'@'127.0.0.1';

-- Kontrola: konto aplikacji NIE ma DELETE (aplikacja stosuje soft delete).
SHOW GRANTS FOR 'taskboard_app'@'127.0.0.1';
SHOW GRANTS FOR 'taskboard_viewer'@'127.0.0.1';
SHOW GRANTS FOR 'taskboard_admin'@'127.0.0.1';
