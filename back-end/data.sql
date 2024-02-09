--
-- import from local external file:
--
\copy Auth(login, password, isAdmin) from './test_users.csv' (format csv)

INSERT INTO Profile(lid, firstName, lastName) VALUES
(1, 'calvin', 'dadson'), (2, 'hobbes', 'tiger'),
(3, 'jean-paul', 'farte'), (4, 'pedro', 'spinouza'),
(5, 'issa', 'delouze'),
(7, 'lucky', 'luke'), (8, 'jolly', 'jumper'),
(10, 'averell', 'dalton'),
(11, 'jack', 'dalton'), (12, 'william', 'dalton'),
(13, 'ma', 'dalton'), (14, 'nermine', 'horry');

INSERT INTO Profile(lid, firstName, lastName, bio) VALUES
(9, 'joe', 'dalton', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor. Cras elementum ultrices diam. Maecenas ligula massa, varius a, semper congue, euismod non, mi. Proin porttitor, orci nec nonummy molestie, enim est eleifend mi, non fermentum diam nisl sit amet erat. Duis semper. Duis arcu massa, scelerisque vitae, consequat in, pretium a, enim. Pellentesque congue. Ut in risus volutpat libero pharetra tempor. Cras vestibulum bibendum augue. Praesent egestas leo in pede. Praesent blandit odio eu enim. Pellentesque sed dui ut augue blandit sodales. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Aliquam nibh. Mauris ac mauris sed pede pellentesque fermentum. Maecenas adipiscing ante non diam sodales hendrerit.
Ut velit mauris, egestas sed, gravida nec, ornare ut, mi. Aenean ut orci vel massa suscipit pulvinar. Nulla sollicitudin. Fusce varius, ligula non tempus aliquam, nunc turpis ullamcorper nibh, in tempus sapien eros vitae ligula. Pellentesque rhoncus nunc et augue. Integer id felis. Curabitur aliquet pellentesque diam. Integer quis metus vitae elit lobortis egestas. Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Morbi vel erat non mauris convallis vehicula. Nulla et sapien. Integer tortor tellus, aliquam faucibus, convallis id, congue eu, quam. Mauris ullamcorper felis vitae erat. Proin feugiat, augue non elementum posuere, metus purus iaculis lectus, et tristique ligula justo vitae magna.
Aliquam convallis sollicitudin purus. Praesent aliquam, enim at fermentum mollis, ligula massa adipiscing nisl, ac euismod nibh nisl eu lectus. Fusce vulputate sem at sapien. Vivamus leo. Aliquam euismod libero eu enim. Nulla nec felis sed leo placerat imperdiet. Aenean suscipit nulla in justo. Suspendisse cursus rutrum augue. Nulla tincidunt tincidunt mi. Curabitur iaculis, lorem vel rhoncus faucibus, felis magna fermentum augue, et ultricies lacus lorem varius purus. Curabitur eu amet.');

INSERT INTO AppGroup(gname, isGroupChat) VALUES
('copaing', FALSE), ('famille dalton', TRUE),
('justiciers', FALSE), ('les philosophes', TRUE),
('dalton -> prison', TRUE), ('les legendes', FALSE),
('calvin_averell', FALSE), ('Big Crous', TRUE),
('Real-PSG', TRUE), ('Soiree en FAO', TRUE),
('Second Big Crous', TRUE);

INSERT INTO UsersInGroup(gid, lid) VALUES
(1, 1), (1, 2),
(2, 9), (2, 10), (2, 11), (2, 12), (2, 13),
(3, 7), (3, 8),
(4, 3), (4, 4), (4, 5),
(5, 7), (5, 9), (5, 10), (5, 11), (5, 12),
(6, 14), (6, 7),
(7, 1), (7, 10),
(8, 1), (8, 5), (8, 8),
(9, 1), (9, 2), (9, 7), (9, 9),
(10, 1), (10, 4), (10, 7),
(11, 1), (11, 4), (11, 7);

INSERT INTO Messages(lid, mtext, mtime, gid) VALUES
(1, 'Je suis grand', '1999-01-08 04:05:06', 1),
(2, 'Je suis petit et jaime beaucoup la crousteam', '2002-03-08 02:09:16', 1),
(1, 'Je suis moyen', '2001-01-07 04:05:06', 1),
(9, 'Rapplique Averell', '2023-10-27 08:20:25', 2),
(10, 'J arriveeee', '2023-10-27 08:20:30', 2),
(12, 'Toujours à la traine...', '2023-10-27 08:20:50', 2),
(10, 'Mais non j arrive', '2023-10-27 08:21:25', 2),
(10, 'Sûr', '2023-10-27 08:21:26', 2),
(13, 'Parlez mieux de mon Avrell', '2023-10-27 10:18:45', 2),
(7, 'Lets go Jolly', '2023-10-27 14:01:15', 3),
(7, 'Allons choper du Dalton', '2023-10-27 14:01:21', 3),
(8, 'Huuuuu', '2023-10-27 14:03:12', 3),
(3, 'Vous êtes nuls les gars', '2021-12-07 18:41:18', 4),
(7, 'Vous êtes cuits', '2023-10-27 18:11:42', 5),
(9, 'Dans tes rêves', '2023-10-27 19:21:15', 5),
(10, 'J arrive les gars', '2023-10-27 19:42:42', 5),
(10, 'Oups mauvais groupe', '2023-10-27 19:42:53', 5),
(1, 'Yo', '2023-10-27 18:11:42', 7),
(10, 'Cava ?', '2023-10-27 18:16:42', 7),
(1, 'Yep et toi ?', '2023-10-27 18:21:42', 7),
(10, 'Tranquille', '2023-10-27 18:23:42', 7);

INSERT INTO Preferences(pftype) VALUES
('amateur de cinema'), ('lecteur avere'), ('sportif invetere'),
('blagueur du dimanche'), ('philantropique'), ('voleur'),
('cowboy'), ('boulanger'), ('sportif');

INSERT INTO UsersPref(lid, pfid) VALUES
(1, 1), (1, 4),
(2, 1),
(3, 1), (3, 2), (3, 4),
(4, 2),
(5, 1), (5, 3),
(7, 7), (7, 1),
(8, 1), (8, 2),
(9, 1), (9, 2), (9, 4), (9, 6),
(10, 1), (10, 2), (10, 3), (10, 4), (10, 6),
(11, 1), (11, 6),
(12, 1), (12, 6),
(13, 1);

INSERT INTO Event(ename, eloc, etime, eduree, edescr, gid) VALUES
 ('Big Crous', 'RU PR', '2024-02-22', '1 hour', 'Notre raison d être', 8)
,('Real-PSG', 'Bernabeu', '2024-02-14', '3 hours', 'Match champions league', 9)
,('Soiree en FAO', 'Meuh', '2024-02-26', '7 hours', 'Soiree collante', 10)
,('Big Crous', 'RU PR', '2024-02-02', '2 hour', 'Notre raison d être', 11)
;

INSERT INTO EventPreferences(eid, pfid) VALUES
(1, 1), (1, 6),
(2, 3),
(3, 7),
(4, 1), (4, 6);
