import anodb  # type: ignore
import json

db = anodb.DB("postgres", "dbname=crousteam", "queries.sql")
<<<<<<< HEAD
res_login = db.get_single_profile(login="jean-paul")
if res_login:
    res_login = json.dumps(list(res_login))
    print(f"res_login={res_login}")
=======
res_pseudo = db.get_pseudo_who_matches_with_preferences(pseudo="jean-paul")
print(f"res_pseudo={list(res_pseudo)}")
>>>>>>> 3f4a9b8 (implémentation de la requête GET dans le profile)
