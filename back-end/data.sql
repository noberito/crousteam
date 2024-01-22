--
-- import from local external file:
--
\copy AppUser(login, password, isAdmin) from './test_users.csv' (format csv)
