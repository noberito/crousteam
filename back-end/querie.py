import anodb  # type: ignore
import json
from datetime import datetime


# Fonction pour convertir les objets datetime en chaînes ISO 8601
def datetime_converter(o):
    if isinstance(o, datetime):
        return o.isoformat()


db = anodb.DB("postgres", "dbname=crousteam", "queries.sql")
login = "calvin"
list_pftype = ["amateur de cinema", "philantropique", "cowboy"]
res_login = db.get_login_who_matches_with_preferences_no_group_chat(login="lucky")
# res_login = db.test()
if res_login:
    res_login = json.dumps(list(res_login), default=datetime_converter)
    print(f"res_login={res_login}")
