#
# Convenient classes for testing a Flask application
#
# api.check(method: str,          # "GET", "POST", "PUT", "PATCH", "DELETE"
#           path: str,            # "/some/path"
#           status: int,          # 200, 201, 204, 400, 401, 403, 404, 405…
#           content: str,         # regexpr to match: r"\[.*\]", r"calvin"…
#           login: str,           # login for authentication, possibly with a default
#           data: dict[str,str],  # http parameters: data={"id": "calvin, …}
#           json: dict[str,str])  # json parameters: json={"id": "hobbes", …}
#
# Examples:
#
#    api.check("PUT", "/store", 405)
#    api.check("GET", "/store", 200, r"\"hobbes\"")
#    api.check("POST", "/store", 201, data={"key": "Roméo", "val": "Juliette"})
#    api.check("POST", "/store", 201, login=ADMIN, json={"key": "Roméo", "val": "Juliette"})
#    api.check("DELETE", "/store", 204)
#
# The check function returns the result of the request, available for further
# processing with: res.text, res.json…
#
# NOTE pytest-flask does not really provided the features I need transparently enough
#

import re
from typing import Any
import logging
log = logging.getLogger("flask_tester")


class Authenticator:
    """Manage authentication for test requests."""

    def __init__(self, auth="basic", carrier="bearer", name="Bearer"):
        assert carrier in ("param", "bearer")
        self._auth = auth
        self._carrier = carrier
        # FIXME name needs more thinking
        self._name = name
        self._passes: dict[str, str] = {}
        self._tokens: dict[str, str] = {}

    def _set(self, login: str, val: str|None, store: dict[str, str]):
        """Set a key/value in a directory, with None for delete."""
        if val is None:
            if login in store:
                del store[login]
        else:
            store[login] = val

    def setPass(self, login: str, passe: str|None):
        """Associate a password to a user."""
        self._set(login, passe, self._passes)

    def setPasses(self, passes: list[str]):
        """Associate a list of login:password."""
        for lp in passes:
            login, passe = lp.split(":", 1)
            self.setPass(login, passe)

    def setToken(self, login: str, token: str|None):
        """Associate a token to a user."""
        self._set(login, token, self._tokens)

    def _param(self, kwargs, key, val):
        """Add request parameter to "json" or "data"."""

        if "json" in kwargs:
            assert isinstance(kwargs["json"], dict)
            kwargs["json"][key] = val
        elif "data" in kwargs:
            assert isinstance(kwargs["data"], dict)
            kwargs["data"][key] = val
        else:
            kwargs["data"] = {key: val}

    def setAuth(self, login: str|None, kwargs: dict[str, Any]):
        """Set request authentication stuff."""

        if login is None:  # not needed
            return

        # use token if available
        if login in self._tokens:
            if self._carrier == "param":
                self._param(kwargs, self._name, self._tokens[login])
            elif self._carrier == "bearer":
                assert "headers" not in kwargs
                kwargs["headers"] = {"Authorization": self._name + " " + self._tokens[login]}
            else:
                pass

        elif login in self._passes:  # http basic auth
            kwargs["auth"] = (login, self._passes[login])
        else:  # fake
            self._param(kwargs, "LOGIN", login)


class RequestFlaskResponse:
    """Wrapper to return a Flask-looking response from a request response.

    This only work for simple responses.

    Available attributes:
    - status_code: integer status code
    - data: body as bytes
    - text: body as a string
    - headers: dict of headers and their values
    - cookies: dict of cookies
    - json: JSON-converted body, or None
    - is_json: whether body was in JSON
    """

    def __init__(self, response):
        self._response = response
        self.status_code = response.status_code
        self.raw = response.content
        self.data = response.content
        self.text = response.text
        self.headers = response.headers
        self.cookies = response.cookies
        try:
            self.json = response.json()
            self.is_json = True
        except Exception:
            self.json = None
            self.is_json = False


class Client:
    """Common class for flask authenticated testing."""

    def __init__(self, auth: Authenticator, default_login: str|None = None):
        self._auth = auth
        self._default_login = default_login

    def setToken(self, login: str, token: str|None):
        """Associate a token to a login, None to remove."""
        self._auth.setToken(login, token)

    def setPass(self, login: str, password: str|None):
        """Associate a password to a login, None to remove."""
        self._auth.setPass(login, password)

    def _request(method: str, path: str, **kwargs):
        """Run a request and return response."""
        raise Exception("not implemented")

    def check(self, method: str, path: str, status: int, content: str|None = None, **kwargs):
        """Run a query and check the response.

        - method: HTTP method ("GET", "POST", "PATCH", "DELETE"…)
        - path: local path under the base URL
        - status: expect HTTP status for response
        - content: regular expression in response body
        - login: authenticated user, use explicit None to skip
        - **kwargs: more request parameters (headers, data, json…)
        """

        if "login" in kwargs:
            login = kwargs["login"]
            del kwargs["login"]
        else:  # if unset, use default
            login = self._default_login

        # perform the HTTP request
        self._auth.setAuth(login, kwargs)
        res = self._request(method, path, **kwargs)  # type: ignore

        # show error before aborting
        if res.status_code != status:
            log.error(f"bad {status} result: {res.status_code} {res.text[:50]}")
        assert res.status_code == status

        if content is not None:
            if not re.search(content, res.text, re.DOTALL):
                log.error(f"cannot find {content} in {res.text}")
                assert False, "content not found"

        return res


class RequestClient(Client):
    """Request-based test provider."""

    def __init__(self, auth: Authenticator, base_url: str, default_login=None):
        super().__init__(auth, default_login)
        self._base_url = base_url
        # reuse connections, otherwise it is too slow…
        from requests import Session
        self._requests = Session()

    def _request(self, method, path, **kwargs):
        res = self._requests.request(method, self._base_url + path, **kwargs)
        return RequestFlaskResponse(res)


class FlaskClient(Client):
    """Flask-based test provider."""

    def __init__(self, auth: Authenticator, default_login=None):
        super().__init__(auth, default_login)
        # get the standard test client
        from app import app
        self._client = app.test_client()

    def _request(self, method, path, **kwargs):
        return self._client.open(method=method, path=path, **kwargs)
