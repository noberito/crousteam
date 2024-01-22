#! /usr/bin/env python3
#
# Run internal (flask) or external (requests) application tests.
#
# The test assumes some initial data and resets the database to the initial
# state, so that it can be run several times if no failure occurs.
#
# The test could initialize some database, but I also want to use it against a
# deployed version and differing databases, so keep it light.
#

import pytest
import re
import os
import flask_tester as ft
import logging

logging.basicConfig(level=logging.INFO)
log = logging.getLogger("test")

# real (or fake) authentication logins
ADMIN, NOADM = "calvin", "hobbes"


@pytest.fixture
def authenticator():
    auth = ft.Authenticator()
    # initialize user passwords from the environment
    if "APP_AUTH" in os.environ:
        # we are running with a real server with authentication
        log.warning("loading user credentials from APP_AUTH environment variable")
        auth.setPasses(os.environ["APP_AUTH"].split(","))
    else:
        log.warning("use default fake users")
    yield auth


@pytest.fixture
def api(authenticator):
    # return Request or Flask test client depending on "APP_URL"
    if "APP_URL" in os.environ:
        log.warning("# running external tests")
        yield ft.RequestClient(authenticator, os.environ["APP_URL"])
    else:
        log.warning("# running internal tests")
        yield ft.FlaskClient(authenticator)


# sanity check
def test_sanity(api):
    if "APP_URL" in os.environ:
        assert re.match(r"https?://", os.environ["APP_URL"])
    res = api.check("GET", "/version", 200, login=ADMIN, data={"sleep": 0.1})
    assert res.json and isinstance(res.json, dict)


def test_who_am_i(api):
    api.check("GET", "/who-am-i", 401)
    api.check("GET", "/who-am-i", 200, ADMIN, login=ADMIN)
    api.check("GET", "/who-am-i", 200, NOADM, login=NOADM)
    api.check("POST", "/who-am-i", 405, login=ADMIN)
    api.check("PUT", "/who-am-i", 405, login=ADMIN)
    api.check("PATCH", "/who-am-i", 405, login=ADMIN)
    api.check("DELETE", "/who-am-i", 405, login=ADMIN)


# /login and keep tokens
def test_login(api):
    # test BASIC auth
    res = api.check("GET", "/who-am-i", 200, login=ADMIN)
    assert ADMIN in res.text
    log.warning(f"headers: {res.headers}")
    assert res.headers["FSA-User"] == f"{ADMIN} (basic)"
    # GET login with basic auth
    admin_token = api.check("GET", "/login", 200, login=ADMIN).json
    assert f":{ADMIN}:" in admin_token
    api.setToken(ADMIN, admin_token)
    res = api.check("GET", "/who-am-i", 200, login=ADMIN)
    assert ADMIN in res.text
    assert res.headers["FSA-User"] == f"{ADMIN} (token)"
    # hobbes
    noadm_token = api.check("GET", "/login", 200, login=NOADM).json
    assert f":{NOADM}:" in noadm_token
    api.setToken(NOADM, noadm_token)
    # same with POST and parameters
    api.check("POST", "/login", 401, login=None)
    res = api.check(
        "POST",
        "/login",
        201,
        data={"login": "calvin", "password": "hobbes"},
        login=None,
    )
    tok = res.json
    assert ":calvin:" in tok
    assert res.headers["FSA-User"] == "calvin (param)"
    res = api.check(
        "POST",
        "/login",
        201,
        json={"login": "calvin", "password": "hobbes"},
        login=None,
    )
    tok = res.json
    assert ":calvin:" in tok
    assert res.headers["FSA-User"] == "calvin (param)"
    # test token auth
    api.setToken(ADMIN, None)
    api.setToken(NOADM, None)


# /whatever # BAD URI
def test_whatever(api):
    api.check("GET", "/whatever", 404)
    api.check("POST", "/whatever", 404)
    api.check("DELETE", "/whatever", 404)
    api.check("PUT", "/whatever", 404)
    api.check("PATCH", "/whatever", 404)


# /version
def test_version(api):
    # only GET is implemented
    api.check("GET", "/version", 200, '"calvin"', login=ADMIN)
    api.check("GET", "/version", 200, '"hobbes"', login=NOADM)
    api.check("GET", "/version", 200, r"null", login=None)
    api.check("POST", "/version", 405)
    api.check("DELETE", "/version", 405)
    api.check("PUT", "/version", 405)
    api.check("PATCH", "/version", 405)


def test_stats(api):
    api.check("GET", "/stats", 401, login=None)
    api.check("GET", "/stats", 200, r"[0-9]", login=ADMIN)
    api.check("GET", "/stats", 403, login=NOADM)
    api.check("POST", "/stats", 405, login=ADMIN)
    api.check("PUT", "/stats", 405, login=ADMIN)
    api.check("PATCH", "/stats", 405, login=ADMIN)
    api.check("DELETE", "/stats", 405, login=ADMIN)
    res = api.check("GET", "/stats", 200, login=ADMIN)
    assert res.json is not None


# /register
def test_register(api):
    # register a new user
    user, pswd = "dyna-user", "dyna-user-pass-123"
    api.setPass(user, pswd)
    # bad login with a space
    api.check(
        "POST",
        "/register",
        400,
        data={"login": "this is a bad login", "password": pswd},
        login=None,
    )
    # login too short
    api.check(
        "POST", "/register", 400, json={"login": "x", "password": pswd}, login=None
    )
    # login already exists
    api.check(
        "POST", "/register", 409, data={"login": "calvin", "password": "p"}, login=None
    )
    # missing "login" parameter
    api.check("POST", "/register", 400, json={"password": pswd}, login=None)
    # missing "password" parameter
    api.check("POST", "/register", 400, data={"login": user}, login=None)
    # password is too short
    api.check(
        "POST", "/register", 400, json={"login": "hello", "password": ""}, login=None
    )
    # password is too simple
    # api.check("POST", "/register", 400, json={"login": "hello", "password": "world!"}, login=None)
    # at last one which is expected to work!
    api.check(
        "POST", "/register", 201, json={"login": user, "password": pswd}, login=None
    )
    user_token = api.check("GET", "/login", 200, r"^([^:]+:){3}[^:]+$", login=user).json
    api.setToken(user, user_token)
    api.check("DELETE", f"/users/{user}", 204, login=ADMIN)
    api.check("DELETE", "/users/no-such-user", 404, login=ADMIN)
    api.check("DELETE", f"/users/{ADMIN}", 400, login=ADMIN)
    api.setToken(user, None)
    api.setPass(user, None)


# /users
def test_users(api):
    api.check("GET", "/users", 401, login=None)
    api.check("GET", "/users", 403, login=NOADM)
    api.check("GET", "/users", 200, r"calvin", login=ADMIN)
    api.check("POST", "/users", 405, login=ADMIN)
    api.check("PUT", "/users", 405, login=ADMIN)
    api.check("PATCH", "/users", 405, login=ADMIN)
    api.check("DELETE", "/users", 405, login=ADMIN)


# http -> https
def test_redir(api):
    url = os.environ.get("APP_URL")
    if url and re.match(r"https://", url):
        log.info(f"testing redirection to {url}")
        api._base_url = url.replace("https://", "http://")
        # redirect probably handled by reverse proxy
        api.check("GET", "/version", 302, allow_redirects=False)
        api.check("POST", "/version", 302, allow_redirects=False)
        api.check("PUT", "/version", 302, allow_redirects=False)
        api.check("PATCH", "/version", 302, allow_redirects=False)
        api.check("DELETE", "/version", 302, allow_redirects=False)
        api._base_url = url
    else:
        pytest.skip("cannot test ssl redir without ssl")


def test_messages(api):
    api.check(
        "GET",
        "/messages",
        200,
        r"petit",
        data={"pseudo": "calvin", "gname": "copaing"},
        login=ADMIN,
    )
