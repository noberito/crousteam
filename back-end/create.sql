--
-- Authentication Data
--
-- *MUST* be consistent with "data.sql" import and "test_users.in"
CREATE TABLE IF NOT EXISTS Auth(
  lid SERIAL8 PRIMARY KEY,
  login TEXT UNIQUE NOT NULL
    CHECK (LENGTH(login) >= 3 AND login ~ E'^[a-zA-Z][-a-zA-Z0-9_@\\.]*$'),
  email TEXT DEFAULT NULL CHECK (email IS NULL OR email ~ E'@') UNIQUE,
  password TEXT NOT NULL,
  created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  isAdmin BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS Preferences(
  pfid SERIAL8 PRIMARY KEY,
  pftype TEXT NOT NULL CHECK (LENGTH(pftype) BETWEEN 1 AND 1024),
  UNIQUE (pftype)
);

CREATE TABLE IF NOT EXISTS Profile(
  lid INTEGER NOT NULL,
  firstName TEXT NOT NULL,
  lastName TEXT NOT NULL,
  bio TEXT DEFAULT 'Hello I m new user',
  naissance DATE DEFAULT NULL,
  photoPath TEXT DEFAULT NULL,
  CONSTRAINT fk_user
    FOREIGN KEY (lid)
      REFERENCES Auth(lid)
      ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS UsersPref(
  lid INTEGER NOT NULL,
  pfid INTEGER NOT NULL,
  CONSTRAINT fk_auth
    FOREIGN KEY (lid)
      REFERENCES Auth (lid)
      ON DELETE CASCADE,
  CONSTRAINT fk_preferences
    FOREIGN KEY (pfid)
      REFERENCES Preferences (pfid)
      ON DELETE CASCADE,
  PRIMARY KEY (lid,pfid)
);

CREATE TABLE IF NOT EXISTS EventType (
  tid SERIAL8 PRIMARY KEY,
  tname TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS AppGroup(
  gid SERIAL8 PRIMARY KEY,
  gname TEXT NOT NULL UNIQUE,
  isGroupChat BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS UsersInGroup(
  gid INTEGER NOT NULL,
  lid INTEGER NOT NULL,
  UNIQUE(gid, lid),
  CONSTRAINT fk_group
    FOREIGN KEY (gid)
    REFERENCES AppGroup (gid)
    ON DELETE CASCADE,
  CONSTRAINT fk_auth
    FOREIGN KEY (lid)
    REFERENCES Auth (lid)
    ON DELETE CASCADE,
  PRIMARY KEY (gid,lid)
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
  lid INTEGER NOT NULL,
  UNIQUE (eid, lid),
  CONSTRAINT fk_event
    FOREIGN KEY (eid)
    REFERENCES Event (eid)
    ON DELETE CASCADE,
  CONSTRAINT fk_user
    FOREIGN KEY (lid)
    REFERENCES Auth (lid)
    ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Messages(
  mid SERIAL8 PRIMARY KEY,
  lid INTEGER NOT NULL,
  mtext TEXT NOT NULL,
  mtime TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  gid INTEGER NOT NULL,
  UNIQUE (lid, mtext, mtime),
  CONSTRAINT fk_lid
    FOREIGN KEY (lid)
    REFERENCES Auth (lid)
    ON DELETE CASCADE,
  CONSTRAINT fk_gid
    FOREIGN KEY (gid)
    REFERENCES AppGroup (gid)
    ON DELETE CASCADE
);
