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
import uuid
import os
import re
import sys
import datetime
import logging
from importlib.metadata import version as pkg_version
from json import dumps as json_dumps
from pathlib import Path
from werkzeug.datastructures import FileStorage

# initial logging configuration
logging.basicConfig(level=logging.INFO)

# start and configure flask service
import FlaskSimpleAuth as fsa
from FlaskSimpleAuth import jsonify as json, JsonData  # type: ignore

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


class StrList(list):
    def __init__(self, li):
        if not isinstance(li, list):
            raise ValueError("expecting a list...")
        for i in li:
            if not isinstance(i, str):
                raise ValueError("expecting a list of strings")
        super().__init__(li)


# permissions
# access to messages and groups
@app.object_perms("message")
def check_user_perms_write_into_group(login: str, gid: int, _mode) -> bool:
    adm = db.get_auth_login(login=login)
    if adm[1]:
        return True
    res = db.get_auth_write_group(login=login, gid=gid)
    return bool(res)


@app.object_perms("event")
def check_user_perms_delete_group(login: str, eid: int, _mode) -> bool:
    adm = db.get_auth_login(login=login)
    if adm[1]:
        return True
    res = db.get_auth_delete_group(login=login, eid=eid)
    return bool(res)


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
def post_register(
    login: str,
    password: str,
    firstName: str,
    lastName: str,
    bio: str,
    naissance: str,
    photoPath: str,
):

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
    lid = db.insert_auth(
        login=login, password=app.hash_password(password), is_admin=False
    )

    db.post_info_register(
        lid=int(lid),
        firstName=firstName,
        lastName=lastName,
        bio=bio,
        naissance=naissance,
        photoPath=photoPath,
    )
    return json(lid), 201


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


# ABOUT CONVERSATIONS
#
# Displays the conversation with the id being gid
@app.get("/messages/gid:<gid>", authorize=("message", "gid"))
def get_messages(gid: int):
    gid_valid = db.is_gid_valid(gid=gid)
    if gid_valid:
        res = db.get_messages(gid=int(gid))
        return json(res), 200
    return "no group with this id", 404


# Get the group gid between the current user and someone else
@app.get("/group-gid", authorize="ALL")
def get_group_gid(user: fsa.CurrentUser, login2: str):
    lid1 = db.get_lid_from_login(login=user)
    lid2 = db.get_lid_from_login(login=login2)
    gid = db.is_people_already_in_the_same_group_with_login(lid1=lid1, lid2=lid2)
    if gid:
        return json({"gid": gid}), 200
    else:
        return json({"gid": ""}), 200


# Post message on a group chat
@app.post("/messages/gid:<gid>", authorize=("message", "gid"))
def post_messages(login: fsa.CurrentUser, mtext: str, gid: int):
    lid = db.get_lid_from_login(login=login)
    db.post_messages(lid=lid, mtext=mtext, gid=gid)
    return "", 201


# Displays all the conversations the user has
@app.get("/all-conversations", authorize="ALL")
def get_all_conversations(user: fsa.CurrentUser):
    res = db.get_all_conversations(login=user)
    return json(res), 200


# INFO ON PROFILE
#
# Get all info on profiles (only for admin)
@app.get("/profiles", authorize="ADMIN")
def get_all_profile():
    res_tot = db.all_info_profile()
    return json(res_tot), 200


# Post info on the profile
@app.post("/profile", authorize="ALL")
def post_info_register(
    lid: int,
    firstName: str,
    lastName: str,
    bio: str,
    naissance: str,
    photoPath: str,
):
    already_exist = db.get_single_profile(login=app.current_user())
    if already_exist:
        return "profile of this login already exist", 404
    res = db.post_info_register(
        lid=lid,
        firstName=firstName,
        lastName=lastName,
        bio=bio,
        naissance=naissance,
        photoPath=photoPath,
    )
    return json(res), 201


# To delete your own profile
@app.delete("/profile", authorize="ALL")
def delete_info_profile():
    exist = db.get_single_profile(login=app.current_user())
    if exist:
        db.delete_info_profile(login=app.current_user())
        return "", 204
    return "login not found", 404


# To patch your own profile
@app.patch("/profile", authorize="ALL")
def update_info_profile(
    user: fsa.CurrentUser,
    firstName: str,
    lastName: str,
    bio: str,
    naissance: datetime.date,
    photoPath: str,
):
    db.update_info_profile(
        login=user,
        firstName=firstName,
        lastName=lastName,
        bio=bio,
        naissance=naissance,
        photoPath=photoPath,
    )
    return "", 204


# CREATION OF GROUP CHAT
#
# Create a new group of 2
@app.post("/group-chat-2", authorize="ALL")
def create_chat_between_2_users(login1: str, login2: str):
    lid1 = db.get_lid_from_login(login=login1)
    lid2 = db.get_lid_from_login(login=login2)
    exists2 = db.get_single_lid(lid=lid2)
    exists1 = db.get_single_lid(lid=lid1)
    if not exists1 or not exists2:
        return "one of the two doesn't exist", 404
    group_exist = db.is_people_already_in_the_same_group(lid1=lid1, lid2=lid2)
    if group_exist:
        return "group already exists", 404
    gid = db.create_group_of_two(gname="test_name")
    db.add_people_into_group_ecreator(gid=gid, lid=lid1)
    db.add_people_into_group_ecreator(gid=gid, lid=lid2)
    return json(gid), 201


# Delete a group chat
@app.delete("/group-chat-2/gid:<gid>", authorize=("message", "gid"))
def delete_group_chat(gid: int):
    to_delete = db.get_single_group_chat(gid=gid)
    if not to_delete:
        return "no group to delete", 404
    db.delete_group_chat(gid=gid)
    return "", 204


# CREATION AND DISPLAYS OF EVENTS
#
# Displays all events
@app.get("/events", authorize="ALL")
def get_event_with_preferences(preferences_list: StrList = None):
    if not preferences_list:
        res = db.get_all_events()
    else:
        res = db.get_all_events_with_preferences(
            preferences_list=json_dumps(preferences_list)
        )
    return json_dumps(list(res)), 200


# Get the group id linked to the event
@app.get("/event-gid", authorize="ALL")
def get_gid_from_eid(eid: int):
    gid = db.get_gid_from_eid(eid=eid)
    return json(gid), 200


# Create a new event
@app.post("/event", authorize="ALL")
def create_event(
    user: fsa.CurrentUser,
    ename: str,
    eloc: str,
    edate: datetime.date,
    etime: datetime.time,
    eduree: datetime.time,
    edescr: str,
    preferences_list: dict = None,
):
    exist_already = db.get_single_event(
        ename=ename, eloc=eloc, etime=etime, edate=edate
    )
    if exist_already:
        return "the same event already exist", 404
    gid = db.create_group_chat_link_to_the_event(ename=ename)
    eid = db.add_event(
        ename=ename,
        eloc=eloc,
        edate=edate,
        etime=etime,
        eduree=eduree,
        edescr=edescr,
        gid=int(gid),
    )
    lid = db.get_lid_from_login(login=user)
    if lid != 1:
        db.add_people_into_group_ecreator(gid=gid, lid=1)
    else:
        db.add_people_into_group(gid=gid, lid=2)
    db.add_people_into_group_ecreator(gid=gid, lid=lid)
    if preferences_list:
        for pfid in preferences_list.keys():
            if preferences_list[pfid]:
                db.add_event_preferences(eid=eid, pfid=pfid)
    return json(eid), 201


# Delete an event
@app.delete("/event", authorize=("event", "eid"))
def delete_event(eid: int):
    exist_already = db.get_single_event_with_eid(eid=eid)
    if not exist_already:
        return "no event to delete", 404
    db.delete_event(eid=eid)
    return "", 204


@app.delete("/event-gid/<gid>", authorize="ALL")
def delete_event_gid(gid: int):
    exist_already = db.get_single_group_chat(gid=gid)
    if not exist_already:
        return "no event to delete", 404
    db.delete_group_chat(gid=gid)
    return "", 204


@app.post("/event/<login>", authorize="ALL")
def insert_people_into_the_event_group_chat(eid: int, login: str):
    people_exist = db.get_single_profile(login=login)
    group_exist = db.get_single_event_with_eid(eid=eid)
    if not group_exist or not people_exist:
        return "group or login does not exist", 404
    gid = db.get_group_of_event(eid=eid)
    lid = db.get_lid_from_login(login=login)
    login_already_in_this_group = db.get_if_people_into_group(gid=gid, lid=lid)
    if login_already_in_this_group:
        return "already in this group", 404
    db.add_people_into_group(gid=gid, lid=lid)
    return "", 201


# GET INFORMATIONS
#
# Get first and last name from the user
@app.get("/first-last-name-photo", authorize="ALL")
def get_first_last_name(user: fsa.CurrentUser):
    res = db.get_first_last_name_photo(login=user)
    return json(res), 200


# Get all the informations of the user
@app.get("/all-info", authorize="ALL")
def get_all_info(user: fsa.CurrentUser):
    res = db.get_all_info(login=user)
    return json(res), 200


# Get all information of an user
@app.get("/all-info/<login>", authorize="ALL")
def get_all_info_login(login: str):
    res = db.get_all_info(login=login)
    return json(res), 200


# ABOUT PREFERENCES OF USERS
#
# Post preferences of an user (when creating an account)
@app.post("/preferences/<login>", authorize="ANY")
def post_preferences(list_pftype: StrList, login: str):
    s = 0
    for pftype in list_pftype:
        app.logger.info(pftype)
        already = db.preference_already(login=login, pftype=pftype)
        if not already:
            db.insert_preference(login=login, pftype=pftype)
            s += 1
    if s == 0:
        return "Nothing to insert", 404
    return "", 201


# Delete preferences from the user
@app.delete("/preferences", authorize="ALL")
def delete_preferences(user: fsa.CurrentUser, list_pftype: StrList):
    s = 0
    for pftype in list_pftype:
        already = db.preference_already(login=user, pftype=pftype)
        if already:
            db.delete_preference(login=user, pftype=pftype)
            s += 1
    if s == 0:
        return "Nothing to delete", 404
    return "", 204


# Patch preferences from the user
@app.patch("/preferences", authorize="ALL")
def update_info_profile_preferences(user: fsa.CurrentUser, list_pftype: StrList):
    s = 0
    db.delete_preferences_for_user(login=user)
    for pftype in list_pftype:
        db.insert_preference(login=user, pftype=pftype)
        s += 1
    return "", 204


# Displays all the users with preferences in common
@app.get("/users-with-preferences", authorize="ALL")
def get_users_with_same_preferences(user: fsa.CurrentUser):
    res_login = db.get_login_who_matches_with_preferences(login=user)
    return list(res_login), 200


# Displays all the users with preferences in common where users are not linked
@app.get("/users-with-preferences-no-group-chat", authorize="ALL")
def get_users_with_same_preferences_no_group_chat(user: fsa.CurrentUser):
    res_login = db.get_login_who_matches_with_preferences_no_group_chat(login=user)
    return list(res_login), 200


# Insert a new preference type
@app.post("/preference-type/<pftype>", authorize="ALL")
def create_preference_type(pftype: str):
    exists1 = db.get_single_preference_type(pftype=pftype)
    if exists1:
        return "already exists", 404
    db.insert_preference_type(pftype=pftype)
    return "", 200


# Delete a preference type
@app.delete("/preference-type/<pftype>", authorize="ALL")
def delete_preference_type(pftype: str):
    to_delete = db.get_single_preference_type(pftype=pftype)
    if not to_delete:
        return "no preference to delete", 404
    db.delete_preference_type(pftype=pftype)
    return "", 204


# Get preferences for a given user
@app.get("/preferences-for-given-user/<login>", authorize="ALL")
def get_preferences_with_certain_user(login: str):
    login_in = db.get_single_profile(login=login)
    if not login_in:
        return "no login", 404
    res_login = db.get_all_user_preferences(login=login)
    return json(res_login), 200


# Get all preferences already implemented
@app.get("/all-possible-preferences/", authorize="ANY")
def get_all_preferences():
    res_login = db.get_all_preferences()
    return json(res_login), 200


# Get all preferences (with id) already implemented
@app.get("/all-possible-preferences-with-id", authorize="ALL")
def get_all_preferences_with_id():
    res_login = db.get_all_preferences_with_id()
    return json(res_login), 200


# INFORMATION OF EVENTS
#
# Get all informations of an event using the group id
@app.get("/event-info/<gid>", authorize="ALL")
def get_event_info(gid: int):
    res = db.get_event_info(gid=gid)
    return json(res), 200


# Get all the informations of events created by the user
@app.get("/event-info-creator", authorize="ALL")
def get_event_info_creator(login: fsa.CurrentUser):
    res = db.get_event_user_create(login=login)
    return json(res), 200


def generate_filename(filename):
    _, extension = os.path.splitext(filename)
    unique_filename = str(uuid.uuid4()) + extension
    return unique_filename


# attention, cette route devrait être protégée !
@app.post("/upload", authorize="ANY")
def post_upload(imageInp: fsa.FileStorage, login: str):
    upload_path = app.config["UPLOAD_FOLDER"]
    unique_filename = generate_filename(imageInp.filename)
    log.debug(f"fn1={os.path.join(upload_path, unique_filename)}")
    saveLink = os.path.join(upload_path, unique_filename)
    imageInp.save(saveLink)
    url = app.config["UPLOADED_URL"]
    log.debug(f"imageLink = {url + unique_filename}")
    if os.path.exists(saveLink):
        exist = db.get_single_profile(login=login)
        if exist:
            db.update_image(
                login=login,
                photoPath=app.config["UPLOADED_URL"] + unique_filename,
            )
            return "", 201
        else:
            return "login doesn't exist", 404
    else:
        return "failed to upload", 422


@app.get("/get_image_path/<filename>", authorize="ALL")
def get_image_path(filename: fsa.path):
    log.debug(f"fn1={filename}")
    # Get the path of the image file
    filename = generate_filename(filename)
    upload_path = os.path.join(app.root_path, app.config["UPLOAD_FOLDER"])
    file_name = Path(os.path.join(upload_path, filename))
    log.debug(f"fn2={file_name}")
    if file_name.exists():
        with open(file_name, "rb") as file:
            file_data = FileStorage(file, filename=os.path.basename(file_name))
            return file_data, 200
    else:
        return "File not found", 404


# SHOULD STAY AS LAST LOC
log.debug("running…")

# A FAIRE : CLEAN LE FICHIER, IMPLEMENT CREATE EVENT ON THE FRONT, AUTHORIZATION, PHOTOS, RAJOUTER DES TESTS POUR DES ERREURS POTENTIELS
