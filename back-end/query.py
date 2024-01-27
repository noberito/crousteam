#! /usr/bin/env python

import os
import sys
import anodb
import inspect

# load configuration file (hmmm… at least it works…)
exec(open(os.environ["APP_CONFIG"]).read())

# create database proxy instance, see database.py
db = anodb.DB(DB_TYPE, DB_CONN, DB_SQL, **DB_OPTIONS)

# run test commands
for code in sys.argv[1:]:
    res = eval(code)
    if inspect.isgenerator(res):
       res = list(res)
    print(f"res ({type(res).__name__}): {res}")
