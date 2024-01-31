import anodb  # type: ignore
import json

db = anodb.DB("postgres", "dbname=crousteam", "queries.sql")
res_login = db.get_all_conversations(login="calvin")
if res_login:
    res_login = json.dumps(list(res_login))
    print(f"res_login={res_login}")
