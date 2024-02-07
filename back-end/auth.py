#
# Authentication and Authorization Helpers
#

import logging
from database import db

log = logging.getLogger(__name__)


# authentication helper function
def get_user_pass(login: str) -> str | None:
    res = db.get_auth_login(login=login)
    return res[0] if res else None


# group authorization helper function
def user_is_admin(login: str) -> bool:
    res = db.get_auth_login(login=login)
    return res[1] if res else False


# register authentication and authorization helpers to FlaskSimpleAuth
def init_app(app):
    log.info(f"initializing auth for {app.name}")
    app.get_user_pass(get_user_pass)
    app.group_check("ADMIN", user_is_admin)
    # app.object_perms(…)
