-- SQL queries to be fed to anosql

-- name: now$
SELECT CURRENT_TIMESTAMP;

-- name: version$
SELECT VERSION();

-- CAUTION used in several places
-- name: get_auth_login^
SELECT password, isAdmin
FROM Auth
WHERE login = :login;

-- CAUTION may be used in several places
-- name: get_auth_login_lock^
SELECT password, isAdmin
FROM Auth
WHERE login = :login
FOR UPDATE;

-- name: get_auth_all
SELECT login, isAdmin
FROM Auth
ORDER BY 1;

-- name: insert_auth$
INSERT INTO Auth(login, password, isAdmin)
VALUES (:login, :password, :is_admin)
RETURNING lid;

-- name: delete_user!
DELETE FROM Auth WHERE login = :login;
