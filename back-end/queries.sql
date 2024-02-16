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

-- name: get_auth_write_group$
SELECT TRUE FROM Auth
JOIN UsersInGroup USING(lid)
WHERE login = :login AND gid = :gid;

-- name: get_auth_delete_group$
SELECT ecreator FROM Auth
JOIN UsersInGroup USING(lid)
JOIN Event USING(gid)
WHERE login = :login AND eid = :eid;

-- name: get_true_if_login$
SELECT TRUE FROM Auth WHERE login = :login;

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
SELECT mid, mtext, mtime::TEXT, login
FROM Messages
JOIN AppGroup USING (gid)
JOIN Auth USING (lid)
WHERE gid = :gid
ORDER BY mtime DESC;

-- name: is_gid_valid^
SELECT TRUE FROM AppGroup WHERE gid = :gid;

-- name: post_messages!
INSERT INTO Messages(lid, mtext, gid)
VALUES (:lid, :mtext, :gid);

-- name: get_all_conversations
WITH Last_message_each_conversations AS (
    SELECT MAX(mtime) AS max_mtime, gid FROM Messages GROUP BY 2 ORDER BY 1 DESC
), Group_without_messages AS (
    SELECT DISTINCT ag.gid, gname, creationDate FROM AppGroup AS ag
    JOIN UsersInGroup AS uig ON ag.gid=uig.gid
    LEFT JOIN Messages AS m ON ag.gid=m.gid
    WHERE m.gid IS NULL
)
SELECT CASE WHEN COALESCE(gname, '') = '' THEN a2.login ELSE gname END AS name_chat, max_mtime::TEXT, ag.gid FROM AppGroup AS ag
JOIN UsersInGroup AS uig ON uig.gid = ag.gid
JOIN Last_message_each_conversations AS lmec ON lmec.gid = ag.gid
JOIN Auth AS a ON uig.lid = a.lid
JOIN UsersInGroup AS uig2 ON uig.gid=uig2.gid AND uig.lid != uig2.lid
LEFT JOIN Auth AS a2 ON uig2.lid=a2.lid AND a2.login != :login
WHERE a.login = :login
UNION
SELECT CASE WHEN COALESCE(gwm.gname, '') = '' THEN a2.login ELSE gname END AS name_chat, creationDate::TEXT, gwm.gid FROM Group_without_messages AS gwm
JOIN UsersInGroup AS uig ON gwm.gid=uig.gid
JOIN Auth AS a ON uig.lid=a.lid
JOIN UsersInGroup AS uig2 ON uig.gid=uig2.gid AND uig.lid != uig2.lid
LEFT JOIN Auth AS a2 ON uig2.lid=a2.lid AND a2.login != :login
WHERE a.login = :login
ORDER BY 2 DESC;

-- name: get_lid_from_login$
SELECT lid FROM Auth WHERE login = :login;

-- name: post_info_register!
INSERT INTO Profile(lid, firstName, lastName, bio, naissance, photoPath)
VALUES (:lid, :firstName, :lastName, :bio, :naissance, :photoPath);

-- name: get_single_profile$
SELECT TRUE FROM Profile WHERE lid = (SELECT lid FROM Auth WHERE login = :login);

-- name: delete_info_profile!
DELETE FROM Profile WHERE lid = (SELECT lid FROM Auth WHERE login = :login);

-- name: all_info_profile
SELECT * FROM Profile;

-- name: update_info_profile!
UPDATE Profile
SET (firstName, lastName, bio, naissance, photoPath) = (:firstName, :lastName, :bio, :naissance, :photoPath)
WHERE lid = (SELECT lid FROM Auth WHERE login = :login);

-- name: update_image!
UPDATE Profile
SET photoPath = :photoPath
WHERE lid = (SELECT lid FROM Auth WHERE login = :login);


-- name: create_group_of_two$
INSERT INTO AppGroup(gname)
VALUES ('')
RETURNING gid;

-- name: is_people_already_in_the_same_group$
SELECT DISTINCT TRUE
 FROM UsersInGroup AS g1 
 JOIN UsersInGroup AS g2 ON g1.gid = g2.gid
 JOIN AppGroup AS g ON g1.gid = g.gid
 WHERE isGroupChat = FALSE
   AND g1.lid = :lid1
   AND g2.lid = :lid2;

-- name: is_people_already_in_the_same_group_with_login$
SELECT g1.gid
 FROM UsersInGroup AS g1 
 JOIN UsersInGroup AS g2 ON g1.gid = g2.gid
 JOIN AppGroup AS g ON g1.gid = g.gid
 WHERE isGroupChat = FALSE
   AND g1.lid = :lid1
   AND g2.lid = :lid2;

-- name: add_people_into_group!
INSERT INTO UsersInGroup(gid, lid)
VALUES (:gid, :lid);

-- name: add_people_into_group_ecreator!
INSERT INTO UsersInGroup(gid, lid, ecreator)
VALUES (:gid, :lid, TRUE);

-- name: get_single_lid^
SELECT login FROM Auth WHERE lid = :lid;

-- name: get_single_group_chat^
SELECT TRUE FROM AppGroup WHERE gid = :gid;

-- name: delete_group_chat!
DELETE FROM AppGroup WHERE gid = :gid;

-- name: get_gid_of_a_group^
SELECT gid FROM AppGroup ORDER BY gid DESC LIMIT 1;

-- name: get_first_last_name_photo^
SELECT firstName, lastName, photoPath
FROM Profile
JOIN Auth USING(lid)
WHERE login = :login;

-- name: get_all_info^
SELECT lid, firstName, lastName, bio, naissance::TEXT, photoPath FROM Profile
JOIN Auth USING(lid)
WHERE login = :login;

-- name: preference_already^
SELECT TRUE FROM UsersPref AS u
JOIN Auth AS a ON u.lid = a.lid
JOIN Preferences AS p ON u.pfid = p.pfid
WHERE (login = :login AND pftype = :pftype);

-- name: insert_preference!
INSERT INTO UsersPref (lid, pfid) 
VALUES (
    (SELECT lid FROM Auth WHERE login = :login),
    (SELECT pfid FROM Preferences WHERE pftype = :pftype)
);

-- name: delete_preference!
DELETE FROM UsersPref
WHERE lid = (SELECT lid FROM Auth WHERE login = :login)
AND pfid = (SELECT pfid FROM Preferences WHERE pftype = :pftype);

-- name: delete_preferences_for_user!
DELETE FROM UsersPref
WHERE lid = (SELECT lid FROM Auth WHERE login = :login);


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


-- name: get_login_who_matches_with_preferences_no_group_chat
WITH LoginPreferences AS (
    SELECT pfid FROM UsersPref JOIN Auth USING(lid) WHERE login = :login
),
UserLid AS (
    SELECT lid FROM Auth WHERE login = :login
),
NotInSamePrivateGroupChat AS (
    SELECT Auth.lid
    FROM Auth
    WHERE Auth.lid <> (SELECT lid FROM UserLid)
      AND Auth.lid IN (
          SELECT DISTINCT U1.lid
          FROM UsersInGroup U1
          JOIN UsersInGroup U2 ON U1.gid = U2.gid AND U1.lid <> U2.lid
          JOIN AppGroup G ON U1.gid = G.gid
          WHERE G.isGroupChat = false AND U2.lid = (SELECT lid FROM UserLid)
      )
)
SELECT DISTINCT Auth.login, Profile.bio, COUNT(*) 
FROM Auth 
JOIN UsersPref USING(lid)
JOIN Profile USING(lid)
WHERE pfid IN (SELECT pfid FROM LoginPreferences) 
  AND login <> :login
  AND Auth.lid NOT IN (SELECT lid FROM NotInSamePrivateGroupChat)
GROUP BY Auth.login, Profile.bio
ORDER BY 3 DESC;


-- name: insert_preference_type!
INSERT INTO Preferences(pftype)
VALUES(:pftype);

-- name: get_single_preference_type$
SELECT TRUE FROM Preferences
WHERE pftype = :pftype;

-- name: delete_preference_type!
DELETE FROM Preferences
WHERE pftype = :pftype;

-- name: get_all_user_preferences
SELECT pftype
FROM Preferences
JOIN UsersPref USING(pfid)
JOIN Auth USING(lid)
WHERE login = :login;

-- name: get_all_preferences
SELECT pftype
FROM Preferences;

-- name: get_all_preferences_with_id
SELECT * FROM Preferences;

-- name: get_single_event^
SELECT TRUE FROM Event
WHERE ename = :ename AND eloc = :eloc AND etime = :etime AND edate = :edate;

-- name: get_all_events
SELECT ename, eloc, edate::TEXT, etime::TEXT, eduree::TEXT, edescr, gid FROM Event
WHERE edate >= CURRENT_DATE
ORDER BY edate, etime, ename;

-- name: get_single_event_with_eid^
SELECT TRUE FROM Event
WHERE eid = :eid;

-- name: get_all_events_with_preferences
SELECT ename, eloc,
edate::TEXT,
etime::TEXT,
eduree::TEXT,
edescr, gid FROM Event
JOIN EventPreferences USING(eid)
JOIN Preferences USING(pfid)
WHERE ('"'||pftype||'"')::JSONB <@ :preferences_list::JSONB AND edate >= CURRENT_DATE
ORDER BY edate, etime, ename;

-- name: get_gid_from_eid^
SELECT gid FROM Event WHERE eid = :eid;

-- name: create_group_chat_link_to_the_event$
INSERT INTO AppGroup(gname, isGroupChat)
VALUES (:ename, TRUE)
RETURNING gid;

-- name: add_event$
INSERT INTO Event (ename, eloc, edate, etime, eduree, edescr, gid)
VALUES (:ename, :eloc, :edate, :etime, :eduree, :edescr, :gid)
RETURNING eid;

-- name: delete_event!
DELETE FROM Event
WHERE eid = :eid;

-- name: get_group_of_event$
SELECT gid FROM Event WHERE eid = :eid;

-- name: get_if_people_into_group^
SELECT TRUE FROM UsersInGroup WHERE gid = :gid AND lid = :lid;

-- name: test
SELECT gname, isGroupChat, creationDate::TEXT FROM AppGroup;

-- name: get_event_info^
SELECT ename, eloc, edate::TEXT, etime::TEXT, eduree::TEXT, edescr, gid, ARRAY_AGG(p.pftype)
FROM Event
JOIN UsersInGroup USING(gid)
JOIN EventPreferences AS ep USING(eid)
RIGHT JOIN Preferences AS p ON ep.pfid = p.pfid
WHERE gid = :gid
GROUP BY eid;

-- name: get_event_user_create
SELECT eid, ename, eloc, edate::TEXT, etime::TEXT, eduree::TEXT, edescr, gid, ARRAY_AGG(p.pftype)
FROM Event
JOIN UsersInGroup USING(gid)
JOIN EventPreferences AS ep USING(eid)
RIGHT JOIN Preferences AS p ON ep.pfid = p.pfid
WHERE ecreator = TRUE AND lid = (SELECT lid FROM Auth WHERE login = :login)
GROUP BY eid
ORDER BY edate, etime, ename;

-- name: add_event_preferences!
INSERT INTO EventPreferences(eid, pfid) VALUES
(:eid, :pfid);