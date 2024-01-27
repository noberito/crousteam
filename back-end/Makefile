#
# Back-end Very Useful Development Makefile
#

SHELL	= /bin/bash
.ONESHELL:

# app parameters
include local.mk

ifndef APP
$(error missing APP macro)
endif

# allow to override python & venv
ifndef PYTHON
PYTHON	= python
endif

ifndef PYTHON_VENV
PYTHON_VENV	= venv
endif

# default target
.PHONY: default
default: clean

# special excluded python files
E.py    = version.py flask_tester.py test.py pass2csv.py query.py querie.py projet.wsgi

# application files
F.py	= $(filter-out $(E.py), $(wildcard *.py))
F.sql	= $(wildcard *.sql)
F.conf	= $(wildcard *.conf)
F.in	= $(wildcard *.in)
F.md	= $(wildcard *.md */*.md)

# file derivations
F.html	= $(F.md:%.md=%.html)
F.csv	= $(F.in:%.in=%.csv)
F.gen	= version.py $(APP).wsgi

# all application source files, whether generated or not
F.src	= $(F.py) $(F.gen) $(F.csv) $(F.sql) $(F.conf) Makefile

#
# Local Postgres Database for Testing
#

PG		= psql -X -v ON_ERROR_STOP=1 -v name=$(APP)
PGOPT	=
DB		= $(APP)

.postgres: create.sql data.sql drop.sql $(F.csv)
	shopt -s -o pipefail errexit
	createdb $(DB) || exit 1
	$(PG) $(PGOPT) -f drop.sql -f create.sql -f data.sql $(DB) | tee $@

# execute an aiosql query with the test database
Q   = db.now()

.PHONY: query
query: $(PYTHON_VENV) .postgres
	source $(PYTHON_VENV)/bin/activate
	export APP_NAME=$(APP) APP_SECRET=$(APP_SECRET) APP_CONFIG=local.conf
	$(PYTHON) ./query.py "$(subst ",\",$(Q))"

#
# Cleanup
#

.PHONY: clean
clean: full-stop
	[ -f app.log ] && echo -e "# REMOVING app.log! RESTART \"make log\"…" >> app.log
	$(RM) app.log app.pid $(F.gen) $(F.csv) .coverage *~
	$(RM) -r __pycache__ .pytype .pytest_cache .postgres htmlcov
	dropdb $(DB) || exit 0

.PHONY: clean.venv
clean.venv: clean
	$(RM) -r $(PYTHON_VENV) .mypy_cache

#
# Check that all seems okay
#
# pandoc pytype  # not really needed
COMMANDS	= psql git $(PYTHON) pip flask pytest mypy flake8

.PHONY: check.env
check.env: $(PYTHON_VENV)
	source $(PYTHON_VENV)/bin/activate
	for cmd in $(COMMANDS) ; do
	  type $$cmd || { echo "missing: $$cmd" >&2 ; exit 1 ; }
	done
	echo "# env seems OK"

#
# Python Virtual Env
#
$(PYTHON_VENV):
	$(PYTHON) -m venv $(PYTHON_VENV)
	source $(PYTHON_VENV)/bin/activate
	pip install -U pip
	pip install -r requirements.txt -r dev-requirements.txt

.PHONY: venv.up
venv.up: $(PYTHON_VENV)
	source $(PYTHON_VENV)/bin/activate
	pip install -U $$(pip freeze | cut -d= -f1)

#
# Generated Files
#

# version information accessible under /version
version.py: $(F.py) $(F.sql) Makefile
	remote=$$(git config --get remote.origin.url)
	branch=$$(git rev-parse --abbrev-ref HEAD)
	rev=$$(git log -1|head -1|cut -d' ' -f2)
	date=$$(git log -1 --format="%cI")
	len=$$(git log | grep '^commit ' | wc -l)
	if [ "$$(git status | grep 'nothing to commit')" ] ; then
	  changed=""
	else
	  changed="M"
	fi
	{
	  echo "remote = \"$$remote\""
	  echo "branch = \"$$branch\""
	  echo "commit = \"$$len$$changed ($$rev)\""
	  echo "date = \"$$date\""
	} > $@

# application WSGI launcher with environment
SECRET_FILES = $(F.py) $(F.sql) $(F.in) $(F.md) Makefile
APP_SECRET = $(shell cat $(SECRET_FILES) | shasum -a 256 | cut -d' ' -f1)

$(APP).wsgi: $(SECRET_FILES)
	{
	  echo "# GENERATED FILE, DO NOT EDIT!"
	  echo "import os"
	  echo "os.environ[\"APP_NAME\"] = \"$(APP)\""
	  echo "os.environ[\"APP_CONFIG\"] = \"/home/$(APP)/conf/server.conf\""
	  echo "os.environ[\"APP_SECRET\"] = \"$(APP_SECRET)\""
	  echo "from app import app as application"
	} > $@

# user accounts with hashed passwords
$(F.csv): $(PYTHON_VENV)
%.csv: %.in
	source $(PYTHON_VENV)/bin/activate
	$(PYTHON) ./pass2csv.py < $< > $@

#
# Flask process management
#

# defaults for local tests
FLASK		= flask
FLASK.opt	= --host="0.0.0.0"

# start app: as it is launched in background, we do not know if it failed
app.pid: $(PYTHON_VENV) version.py .postgres
	source $(PYTHON_VENV)/bin/activate
	export APP_NAME=$(APP) APP_CONFIG="local.conf" APP_SECRET=$(APP_SECRET)
	type $(FLASK) || exit 1  # check for flask
	$(FLASK) --debug --app=app.py run $(FLASK.opt) >> app.log 2>&1 &
	pid=$$!
	echo $$pid > app.pid
	echo "# $(APP) pid: $$pid"

.PHONY: run
run: app.pid

# show available routes
.PHONY: routes
routes: $(PYTHON_VENV) version.py .postgres
	source $(PYTHON_VENV)/bin/activate
	export APP_NAME=$(APP) APP_CONFIG="local.conf" APP_SECRET=$(APP_SECRET)
	$(FLASK) --debug --app=app.py routes -s match

# use colortail if available
HAS_CLT	= $(shell type colortail > /dev/null 2>&1 && echo 1)
HAS_STB	= $(shell type stdbuf > /dev/null 2>&1 && echo 1)

ifeq ($(HAS_CLT)$(HAS_STB),11)
TAIL	= stdbuf -i0 -o0 -e0 colortail -n 30 -k .colortail.conf -q
else
TAIL	= tail
endif

.PHONY: log
log: app.pid
	$(TAIL) -f app.log

# soft stop…
.PHONY: term-stop
term-stop:
	[ -f app.pid ] && {
	  [ -f app.log ] && echo "# TERMINATING FLASK SERVER…" >> app.log
	  kill -SIGTERM $$(cat app.pid)
	  [ -f app.log ] && echo "# FLASK SERVER TERMINATED!" >> app.log
	}
	$(RM) app.pid

ifeq ($(shell uname), Linux)
PKILL	= pkill
else
PKILL	= pkill -f
endif

# hard stop…
.PHONY: full-stop
full-stop: stop
	[ -f app.log ] && echo "# KILLING ALL FLASK SERVERS (just in case)…" >> app.log
	$(PKILL) $(FLASK) || exit 0

.PHONY: stop
stop: term-stop

#
# Local tests
#

LOC_URL = http://0.0.0.0:5000
PYTEST  = pytest --log-level=debug --capture=tee-sys -v
PYTOPT  =
DELAY   = 2

APP_AUTH	= $(shell grep '^[a-z]' test_users.in | cut -d' ' -f1,2 | tr ' \012' ':,' | sed -e 's/,$$//')

.PHONY: app_auth
app_auth:
	@echo "APP_AUTH=$(APP_AUTH)"

.PHONY: check.version
check.version:
	curl -si -X GET $(LOC_URL)/version

.PHONY: check.stats
check.stats:
	curl -si -X GET -u $(ADMIN) $(LOC_URL)/stats

.PHONY: check.local.version
check.local.version: check.version

.PHONY: check.pytest
check.pytest: check.pytest.external

.PHONY: check.pytest.external
check.pytest.external: $(PYTHON_VENV) $(F.src)
	shopt -s -o errexit
	source $(PYTHON_VENV)/bin/activate
	# start test server
	$(MAKE) run
	sleep $(DELAY)
	curl -u $(ADMIN) -s $(LOC_URL)/version || { echo "# flask did not start!" >&2 ; exit 1 ; }
	# external tests: URL to retrieve the server
	export APP_URL="$(LOC_URL)"
	# run tests with admin and noadmin authentication
	export APP_AUTH="$(APP_AUTH)"
	$(PYTEST) $(PYTOPT) test.py
	# stop test server
	$(MAKE) stop

.PHONY: check.pytest.internal
check.pytest.internal: $(PYTHON_VENV) $(F.src) .postgres
	source $(PYTHON_VENV)/bin/activate
	# internal tests: CONFIG but no URL
	export APP_NAME=$(APP) APP_CONFIG="local.conf" APP_SECRET=$(APP_SECRET)
	export APP_AUTH="$(APP_AUTH)"
	$(PYTEST) $(PYTOPT) test.py

.PHONY: check.local.pytest
check.local.pytest: check.pytest

.PHONY: check.coverage
check.coverage: $(PYTHON_VENV)
	source $(PYTHON_VENV)/bin/activate
	$(MAKE) PYTEST="coverage run -m $(PYTEST)" check.pytest.internal
	coverage report --precision=1 --show-missing --fail-under=100 $(F.py) version.py
	coverage html

.PHONY: check.pyright
check.pyright: $(PYTHON_VENV) $(F.py) $(F.gen)
	source $(PYTHON_VENV)/bin/activate
	pyright $(F.py) $(F.gen) test.py

.PHONY: check.mypy
check.mypy: $(PYTHON_VENV) $(F.py) $(F.gen)
	# report syntax and type errors
	source $(PYTHON_VENV)/bin/activate
	mypy --ignore-missing-imports --implicit-optional $(F.py) $(F.gen) test.py

.PHONY: check.pytype
check.pytype: $(PYTHON_VENV) $(F.py) $(F.gen)
	# report syntax and type errors
	source $(PYTHON_VENV)/bin/activate
	pytype $(F.py) $(F.gen) test.py

.PHONY: check.flake8
check.flake8: $(PYTHON_VENV) $(F.py) $(F.gen)
	source $(PYTHON_VENV)/bin/activate
	flake8 --ignore=E128,E227,E302,E305,F401,E402,E501 $(F.py) $(F.gen) test.py

.PHONY: check
check: clean
	shopt -s -o errexit
	$(MAKE) check.env
	$(MAKE) check.mypy
	# $(MAKE) check.pyright
	$(MAKE) check.flake8
	$(MAKE) check.pytest
	$(MAKE) clean
	$(MAKE) check.coverage
	$(MAKE) clean

#
# DEPLOY
#
include deploy.mk

#
# STATS
#
.PHONY: counts
counts:
	# queries: $(shell egrep "^\\s*--\\s*name\\s*:" $(F.sql) | wc -l)
	# tables: $(shell egrep -i "^\\s*create\\s+table" $(F.sql) | wc -l)
	# routes: $(shell egrep -i "^\\s*@app\.(route|get|post|patch|put|delete)" $(F.py) | wc -l)
	cloc --by-file-by-lang $(F.py) test.py $(F.sql)

.PHONY: commits
commits:
	git log | grep "^Author" | cut -d: -f2 | sort | uniq -c | sort -nr
