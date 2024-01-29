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
SELECT mtext, CASE WHEN login = :login THEN 1 ELSE 0 END AS a_ecrit, mtime
FROM Messages
JOIN AppGroup USING (gid)
JOIN Auth USING (lid)
WHERE gname = :gname
ORDER BY mtime DESC;

-- name: post_messages
INSERT INTO Messages(lid, mtext, gid)
VALUES (:lid, :mtext, :gid);

-- name: get_lid_from_login^
SELECT lid FROM Auth WHERE login = :login;

-- name: post_info_register!
INSERT INTO Profile(lid, firstName, lastName, bio, naissance, photoPath)
VALUES (:lid, :firstName, :lastName, :bio, :naissance, :photoPath);

-- name: get_single_profile^
SELECT TRUE FROM Profile WHERE lid = (SELECT lid FROM Auth WHERE login = :login);

-- name: delete_info_profile!
DELETE FROM Profile WHERE lid = (SELECT lid FROM Auth WHERE login = :login);

-- name: all_info_profile
SELECT * FROM Profile;

-- name: update_info_profile!
UPDATE Profile
SET (firstName, lastName, bio, naissance, photoPath) = (:firstName, :lastName, :bio, :naissance, :photoPath)
WHERE lid = (SELECT lid FROM Auth WHERE login = :login);

-- name: create_group_of_two$
INSERT INTO AppGroup(gname)
VALUES (:gname)
RETURNING gid;

-- name: is_people_already_in_the_same_group$
SELECT DISTINCT TRUE
 FROM UsersInGroup AS g1 
 JOIN UsersInGroup AS g2 ON g1.gid = g2.gid
 JOIN AppGroup AS g ON g1.gid = g.gid
 WHERE isGroupChat = FALSE
   AND g1.lid = :lid1
   AND g2.lid = :lid2;

-- name: add_people_into_group!
INSERT INTO UsersInGroup(gid, lid)
VALUES (:gid, :lid);

-- name: get_single_lid^
SELECT login FROM Auth WHERE lid = :lid;

-- name: get_single_group_chat^
SELECT TRUE FROM AppGroup WHERE gid = :gid;

-- name: delete_group_chat!
DELETE FROM AppGroup WHERE gid = :gid;

-- name: get_gid_of_a_group^
SELECT gid FROM AppGroup ORDER BY gid DESC LIMIT 1;

-- name: get_first_last_name^
SELECT firstName, lastName
FROM Profile
JOIN Auth USING(lid)
WHERE login = :login;

-- name: get_all_info^
SELECT * FROM Profile
JOIN Auth USING(lid)
WHERE login = :login;

-- name: preference_already^
SELECT TRUE FROM UsersPref AS u
JOIN Auth AS a
ON u.lid = a.lid
WHERE login = :login AND pfid = :pfid;

-- name: insert_preference!
INSERT INTO UsersPref (lid, pfid) 
VALUES ((SELECT lid FROM Auth WHERE login = :login), :pfid);

-- name: delete_preference!
DELETE FROM UsersPref
WHERE lid = (SELECT lid FROM Auth WHERE login = :login)
AND pfid = :pfid;

-- name: get_login_who_matches_with_preferences
WITH LoginPreferences AS (
    SELECT pfid FROM UsersPref JOIN Auth USING(lid) WHERE login = :login
)
SELECT DISTINCT login, bio, COUNT(*) FROM Auth 
JOIN UsersPref USING(lid)
JOIN Profile USING(lid)
WHERE pfid IN (SELECT pfid FROM LoginPreferences) AND login <> :login
GROUP BY login, bio
ORDER BY 3 DESC;

-- name: get_profile_from_preferences!
SELECT pseudo, firstName, lastName, photoPath
FROM Preferences
JOIN UsersPref USING (pfid)
Join Profile USING(pid)
where pftype = :pftype
ORDER BY 1;

-- name: insert_preference_type!
INSERT INTO Preferences(pfid,pftype)
VALUES (:pfid, :pftype);

-- name: get_single_preference_type$
SELECT TRUE FROM Preferences
WHERE pftype = :pftype;

-- name: delete_preference_type!
DELETE FROM Preferences
WHERE pftype = :pftype;

-- name: get_all_user_preferences!
SELECT pftype 
FROM Preferences
JOIN UsersPref USING (pfid)
Join Profile USING(lid)
where pseudo = :pseudo;


