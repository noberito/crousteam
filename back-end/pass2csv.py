import re
import fileinput
import passlib.context as pc

pm = pc.CryptContext("bcrypt", bcrypt__default_rounds=4)
skip = re.compile(r"^\s*[#$]").match
split = re.compile(r"[ \t]").split

for line in fileinput.input():
    if skip(line):
        continue
    w = split(line.strip(), 2)
    print(f'"{w[0]}","{pm.hash(w[1])}",{w[2] if len(w) > 2 else None}')
