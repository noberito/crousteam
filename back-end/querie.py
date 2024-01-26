import anodb  # type: ignore

db = anodb.DB("postgres", "dbname=crousteam", "queries.sql")
res = db.is_people_already_in_the_same_group(lid1=1, lid2=2)
print(f"res={res}")
