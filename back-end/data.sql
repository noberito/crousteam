--
-- import from local external file:
--
\copy Auth(login, password, isAdmin) from './test_users.csv' (format csv)

INSERT INTO Profile(lid, pseudo) VALUES (1, 'calvin'), (2, 'hobbes');

INSERT INTO AppGroup(gid, gname) VALUES (1, 'copaing');

INSERT INTO UsersInGroup(gid, pid) VALUES (1, 1), (1, 2);

INSERT INTO Messages(lid, mtext, mtime, gid) VALUES 
(1, 'Je suis grand', '1999-01-08 04:05:06', 1),
(2, 'Je suis petit', '2002-03-08 02:09:16', 1),
(1, 'Je suis moyen', '2001-01-07 04:05:06', 1);
