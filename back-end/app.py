#     ____            _      _
#    |  _ \ _ __ ___ (_) ___| |_
#    | |_) | '__/ _ \| |/ _ \ __|
#    |  __/| | | (_) | |  __/ |_
#    |_|   |_|  \___// |\___|\__|
#                  |__/
#
# Any Application Bootstrap
#
# Environment:
#
# - APP_NAME: application name
# - APP_CONFIG: path to configuration file
# - APP_SECRET: secret for token signatures
#
# Configuration:
#
# - APP_LOGGING_LEVEL: level of logging
# - APP_TEST: enable /users routes for testing
#

import os
import re
import sys
import datetime
import logging
from importlib.metadata import version as pkg_version

# initial logging configuration
logging.basicConfig(level=logging.INFO)

# start and configure flask service
import FlaskSimpleAuth as fsa
from FlaskSimpleAuth import jsonify as json  # type: ignore

app = fsa.Flask(os.environ["APP_NAME"])
app.config.from_envvar("APP_CONFIG")

# setup application log
log = logging.getLogger(app.name)
if "APP_LOGGING_LEVEL" in app.config:
    log.setLevel(app.config["APP_LOGGING_LEVEL"])
    log.warning(f"app log set to {logging.getLevelName(log.level)}")
started = datetime.datetime.now()
log.info(f"started on {started}")

# create database connection and load queries based on DB_* directives
import database

database.init_app(app)
from database import db

# authentication and authorization for the app
import auth

auth.init_app(app)


#
# General information about running app.
#
# FIXME should be restricted
#
# GET /version (sleep?)
@app.get("/version", authorize="ANY")
def get_version(sleep: float = 0.0):
    import version

    # possibly include a delay, for testing purposes…
    if sleep > 0:
        import time

        time.sleep(sleep)

    # describe app
    info = {
        # running
        "app": app.name,
        "version": 19,
        "started": str(started),
        # git info
        "git-remote": version.remote,
        "git-branch": version.branch,
        "git-commit": version.commit,
        "git-date": version.date,
        # auth
        "auth": app.config.get("FSA_AUTH", None),
        "user": app.get_user(required=False),
        # database
        "db-type": app.config["DB_TYPE"],
        "db-driver": db._db,
        "db-version": db._db_version,
        "now": db.now(),
        "connections": db._nobjs,
        "hits": app._fsa._cm._cache.hits(),  # type: ignore
        # package versions
        "python": sys.version,
        db._db: db._db_version,
        "postgres": db.version(),
    }

    # other package versions
    for pkg in (
        "FlaskSimpleAuth",
        "flask",
        "aiosql",
        "anodb",
        "cachetools",
        "CacheToolsUtils",
        "ProxyPatternPool",
    ):
        info[pkg] = pkg_version(pkg)

    return info, 200


# GET /stats
@app.get("/stats", authorize="ADMIN")
def get_stats():
    # show aiosql statistics
    dbc = db._count
    return {k: dbc[k] for k in dbc if dbc[k] != 0}, 200


# GET /who-am-i
@app.get("/who-am-i", authorize="ALL")
def get_who_am_i(user: fsa.CurrentUser):
    return json(user), 200


# POST /register (login, password)
@app.post("/register", authorize="ANY")
def post_register(login: str, password: str):
    # check constraints on "login" (these tests are redundant with CHECK)
    if len(login) < 3:
        return "login must be at least 3 chars", 400
    if not re.match(r"^[a-zA-Z][-a-zA-Z0-9_\.]+$", login):
        return "login can only contain simple characters", 400
    # avoid 500 on already existing logins
    if db.get_auth_login(login=login) is not None:
        return f"user {login} already registered", 409
    # log.debug(f"user registration: {login}")
    # NOTE passwords have constraints, see configuration
    aid = db.insert_auth(
        login=login, password=app.hash_password(password), is_admin=False
    )
    return json(aid), 201


# GET /login
#
# NOTE axios accepts `auth` to send a basic auth
@app.get("/login", authorize="ALL", auth="basic")
def get_login(user: fsa.CurrentUser):
    return json(app.create_token(user)), 200


# POST /login (login, password)
#
# NOTE web-oriented approach is to use POST
@app.post("/login", authorize="ALL", auth="param")
def post_login(user: fsa.CurrentUser):
    return json(app.create_token(user)), 201


# routes mostly for testing, can be disabled
if app.config.get("APP_TEST", False):
    # GET /users
    @app.get("/users", authorize="ADMIN")
    def get_users():
        return json(db.get_auth_all()), 200

    # DELETE /users/<login>
    @app.delete("/users/<login>", authorize="ADMIN")
    def delete_users_login(login: str):
        if not db.get_auth_login_lock(login=login):
            return "no such user", 404
        if login == app.get_user():
            return "cannot delete oneself", 400
        # should it forbid deleting admins?
        # a user should rather be disactivated
        db.delete_user(login=login)
        app.password_uncache(login)
        # app.token_uncache(?)
        return "", 204


# ADD NEW CODE HERE


@app.get("/messages", authorize="ANY")
def get_messages(pseudo: str, gname: str):
    res = db.get_messages(pseudo=pseudo, gname=gname)
    return json(res), 200


@app.post("/messages", authorize="ANY")
def post_messages(pseudo: str, mtext: str, gid: int):
    lid = db.get_lid_from_pseudo(pseudo=pseudo)
    db.post_messages(lid=lid, mtext=mtext, gid=gid)
    return "", 201


@app.get("/profile", authorize="ANY")
def get_single_pseudo(pseudo: str):
    res = db.get_single_pseudo(pseudo=pseudo)
    if res:
        return json(res), 200
    return "pseudo not found", 404


@app.post("/profile", authorize="ANY")
def post_info_register(
    lid: int, pseudo: str, firstName: str, lastName: str, naissance: str, photoPath: str
):
    already_exist = db.get_single_pseudo(pseudo=pseudo)
    # log.info(f"already_exist: {already_exist}")
    if already_exist:
        return "pseudo already exist", 404
    res = db.post_info_register(
        lid=lid,
        firstName=firstName,
        lastName=lastName,
        pseudo=pseudo,
        naissance=naissance,
        photoPath=photoPath,
    )
    return json(res), 201


@app.delete("/profile", authorize="ANY")
def delete_info_profile(pseudo: str):
    exist = db.get_single_pseudo(pseudo=pseudo)
    if exist:
        db.delete_info_profile(pseudo=pseudo)
        return "", 204
    return "pseudo not found", 404


@app.post("/group-chat-2", authorize="ANY")
def create_chat_between_2_users(lid1: int, lid2: int):
    exists2 = db.get_single_lid(lid=lid2)
    exists1 = db.get_single_lid(lid=lid1)
    if not exists1 or not exists2:
        return "one of the two doesn't exist", 404
    gid = db.create_group_of_two(gname="test_name")
    db.add_people_into_group(gid=gid, lid=lid1)
    db.add_people_into_group(gid=gid, lid=lid2)
    return "", 204


@app.delete("/group-chat-2", authorize="ANY")
def delete_group_chat(gname: str):
    to_delete = db.get_single_group_chat(gname=gname)
    if not to_delete:
        return "no group to delete", 404
    db.delete_group_chat(gname=gname)
    return "", 204


@app.get("/first-last-name/<pseudo>", authorize="ANY")
def get_first_last_name(pseudo: str):
    res = db.get_first_last_name(pseudo=pseudo)
    if not res:
        return "pseudo not found", 404
    return json(res), 200


@app.get("/all-info/<pseudo>", authorize="ANY")
def get_all_info(pseudo: str):
    res = db.get_all_info(pseudo=pseudo)
    if not res:
        return "pseudo not found", 404
    return json(res), 200


@app.post("/test/insert_preference_type", authorize="ALL")
def test_insert_preference_type(pfid: int, pftype: str):
    res = db.insert_preference_type(pfid=pfid, pftype=pftype)
    if res:
        return json(res), 201
    return "pseudo not found", 404


def test_insert_users_pref(pfid: int, pid: int):
    res = db.insert_users_pref(pfid=pfid, pid=pid)
    if res:
        return json(res), 201
    return "pseudo not found", 404


@app.post("/test/insert_event", authorize="ALL")
def test_insert_event(eid: int, ename: str, eloc: str, etime: datetime.datetime, tid: int, gid: int):
    res = db.insert_event(eid=eid, ename=ename, eloc=eloc, etime=etime, tid=tid, gid=gid)
    if res:
        return json(res), 201
    return "Couldn't insert event", 404


@app.get("/test/get_profile_from_preference_type", authorize="ALL")
def test_get_profile_from_preference_type(pftype: str):
    res = db.get_profile_from_preference_type(pftype=pftype)
    if res:
        return json(res), 201
    return "profile not found", 404


@app.get("/test/get_profile_by_event_type", authorize="ALL")
def test_get_profile_by_event_type(ename: str):
    res = db.get_profile_by_event_type(ename=ename)
    if res:
        return json(res), 201
    return "profile not found", 404

# SHOULD STAY AS LAST LOC
log.debug("running…")
