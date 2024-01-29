import anodb  # type: ignore

db = anodb.DB("postgres", "dbname=crousteam", "queries.sql")
res_pseudo = db.get_all_user_preferences(login="jean-paul")
res_pseudo = [x[0] for x in res_pseudo]
print(f"res_pseudo={list(res_pseudo)}")
