import anodb  # type: ignore

db = anodb.DB("postgres", "dbname=crousteam", "queries.sql")
res_pseudo = db.get_pseudo_who_matches_with_preferences(pseudo="jean-paul")
print(f"res_pseudo={list(res_pseudo)}")
