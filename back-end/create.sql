--
-- Authentication Data
--
-- *MUST* be consistent with "data.sql" import and "test_users.in"
CREATE TABLE IF NOT EXISTS AppUser(
  uid SERIAL8 PRIMARY KEY,
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
  uid INTEGER NOT NULL,
  naissance DATE NOT NULL,
  photo TEXT DEFAULT NULL,
  CONSTRAINT fk_user
    FOREIGN KEY (uid) 
      REFERENCES AppUser(uid)
      ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS UsersPref(
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

CREATE TABLE IF NOT EXISTS EventType (
  tid SERIAL8 PRIMARY KEY,
  tname TEXT NOT NULL,
  UNIQUE(tname)
);

CREATE TABLE IF NOT EXISTS AppGroup(
  gid SERIAL8 PRIMARY KEY,
  gname TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS UsersInGroup(
  gid INTEGER NOT NULL,
  pid INTEGER NOT NULL,
  UNIQUE(gid, pid),
  CONSTRAINT fk_group
    FOREIGN KEY (gid)
    REFERENCES AppGroup (gid)
    ON DELETE CASCADE,
  CONSTRAINT fk_profile
    FOREIGN KEY (pid)
    REFERENCES Profile (pid)
    ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Event(
  eid SERIAL8 PRIMARY KEY,
  ename TEXT NOT NULL,
  eloc TEXT NOT NULL,
  etime TIMESTAMP NOT NULL,
  tid INTEGER NOT NULL,
  gid INTEGER NOT NULL,
  UNIQUE (ename, eloc, etime),
  UNIQUE (gid)
);

CREATE TABLE IF NOT EXISTS UsersInEvent(
  eid INTEGER NOT NULL,
  uid INTEGER NOT NULL,
  UNIQUE (eid, uid),
  CONSTRAINT fk_event
    FOREIGN KEY (eid)
    REFERENCES Event (eid)
    ON DELETE CASCADE,
  CONSTRAINT fk_user
    FOREIGN KEY (uid)
    REFERENCES AppUser (uid)
    ON DELETE CASCADE
);
