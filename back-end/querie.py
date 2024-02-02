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
for pftype in list_pftype:
    already = db.preference_already(login=login, pftype=str(pftype))
    if not already:
        db.insert_preference(login=login, pftype=str(pftype))
res_login = db.test()
if res_login:
    res_login = json.dumps(list(res_login), default=datetime_converter)
    print(f"res_login={res_login}")
