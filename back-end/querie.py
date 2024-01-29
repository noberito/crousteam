import anodb  # type: ignore
import json

db = anodb.DB("postgres", "dbname=crousteam", "queries.sql")
res_login = db.get_login_who_matches_with_preferences(login="jean-paul")
res_login = json.dumps(list(res_login))
print(f"res_login={res_login}")
