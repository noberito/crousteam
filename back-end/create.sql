--
-- Authentication Data
--
-- *MUST* be consistent with "data.sql" import and "test_users.in"
CREATE TABLE IF NOT EXISTS Auth(
  lid SERIAL8 PRIMARY KEY,
  login TEXT UNIQUE NOT NULL
    CHECK (LENGTH(login) >= 3 AND login ~ E'^[a-zA-Z][-a-zA-Z0-9_@\\.]*$'),
  email TEXT DEFAULT NULL CHECK (email IS NULL OR email ~ E'@'),
  password TEXT NOT NULL,
  created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  isAdmin BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS Preferences(
  pfid SERIAL8 PRIMARY KEY,
  pftype TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS Profile(
  pid SERIAL8 PRIMARY KEY,
  lid INTEGER NOT NULL,
  date_naissance TIMESTAMP NOT NULL,
  photo TEXT DEFAULT NULL,
  CONSTRAINT fk_auth
    FOREIGN KEY (lid) 
      REFERENCES Auth(lid)
      ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Pref_of_user(
  pid INTEGER NOT NULL,
  pfid INTEGER NOT NULL,
  CONSTRAINT fk_profile
    FOREIGN KEY (pid)
      REFERENCES Profile (pid)
      ON DELETE CASCADE,
  CONSTRAINT fk_preferences
    FOREIGN KEY (pfid)
      REFERENCES Preferences (pfid)
      ON DELETE CASCADE
);
