import anodb  # type: ignore
import json

db = anodb.DB("postgres", "dbname=crousteam", "queries.sql")
res_login = db.get_single_profile(login="jean-paul")
if res_login:
    res_login = json.dumps(list(res_login))
    print(f"res_login={res_login}")
