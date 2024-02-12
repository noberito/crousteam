import anodb  # type: ignore
import json
from datetime import datetime


# Fonction pour convertir les objets datetime en chaînes ISO 8601
def datetime_converter(o):
    for i in o:
        if isinstance(i, datetime):
            i = i.isoformat()


db = anodb.DB("postgres", "dbname=crousteam", "queries.sql")
login = "calvin"
list_pftype = ["amateur de cinema", "philantropique", "cowboy"]

ename = "Bigman_streep"
eloc = "Paris"
etime = "2024-04-25"
edate = "10:00:00"
eduree = "03:00:00"


# gid = db.create_group_chat_link_to_the_event(ename=ename)
# eid = db.add_event(
#     ename=ename, eloc=eloc, edate=edate, etime=etime, eduree=eduree, gid=int(gid)
# )
# lid = db.get_lid_from_login(login="hobbes")
# db.add_people_into_group_ecreator(gid=gid, lid=lid)
res_login = db.get_event_info(gid=3)
# res_login2 = db.test()

# (preferences_list=json.dumps(list_pftype))
# res_login = db.test()
if res_login:
    # res_login = json.dumps(list(res_login), default=datetime_converter)
    print(f"res_login={json.dumps(list(res_login))}")
    # print(f"res_login={json.dumps(list(res_login2))}")
