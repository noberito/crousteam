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

-- name: get_messages
SELECT mtext, CASE WHEN pseudo = :pseudo THEN 1 ELSE 0 END AS a_ecrit, mtime
FROM Messages
JOIN AppGroup USING (gid)
JOIN Profile USING (lid)
WHERE gname = :gname
ORDER BY mtime DESC;

-- name: post_messages
INSERT INTO Messages(lid, mtext, gid)
VALUES (:lid, :mtext, :gid);

-- name: get_lid_from_pseudo^
SELECT lid FROM Profile WHERE pseudo = :pseudo;

-- name: post_info_register!
INSERT INTO Profile(lid, firstName,lastName, pseudo, naissance, photoPath)
VALUES (:lid, :firstName, :lastName, :pseudo, :naissance, :photoPath);

-- name: get_single_pseudo^
SELECT TRUE FROM Profile WHERE pseudo = :pseudo;

-- name: delete_info_profile!
DELETE FROM Profile WHERE pseudo = :pseudo;

-- name: create_group_of_two$
INSERT INTO AppGroup(gname)
VALUES (:gname)
RETURNING gid;

-- name: add_people_into_group!
INSERT INTO UsersInGroup(gid, lid)
VALUES (:gid, :lid);

-- name: get_single_lid^
SELECT pseudo FROM Profile WHERE lid = :lid;

-- name: get_single_group_chat^
SELECT TRUE FROM AppGroup WHERE gname = :gname;

-- name: delete_group_chat!
DELETE FROM AppGroup WHERE gname = :gname;

-- name: get_first_last_name^
SELECT firstName, lastName FROM Profile JOIN Auth USING (lid) WHERE pseudo = :pseudo;

-- name: get_all_info^
SELECT * FROM Profile WHERE pseudo = :pseudo;

-- name: get_profile_from_preferences!
SELECT pseudo, firstName, lastName, photoPath
FROM Preferences
JOIN UsersPref USING (pfid)
Join Profile USING(pid)
where pftype:= pftype
ORDER BY 1;
