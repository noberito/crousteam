#
# Deployment Makefile (for development only!)
#
# - you do NOT want to execute "drop.sql" in production!
# - schema management and usage should be distinct
#

.PHONY: clean.deploy
clean: clean.deploy
clean.deploy:
	$(RM) $(F.html)

.PHONY: perms
perms: $(F.gen) $(F.csv) $(F.html)
	chmod a+r $(F.conf) $(F.sql) $(F.py) $(F.gen) $(F.csv) $(F.html)
	for dir in www assets ; do
	  if [ -d $$dir ] ; then
	    find $$dir -type d -print0 | xargs -0 chmod a+rx
	    find $$dir -type f -print0 | xargs -0 chmod a+r
	  fi
	done

RSYNC	= rsync -rLpgodv

.PHONY: deploy
deploy: perms
	shopt -s -o errexit
	# send files
	$(RSYNC) $(F.conf) $(USER)@$(SERVER):conf/
	$(RSYNC) $(F.py) $(F.sql) $(F.gen) $(F.csv) $(USER)@$(SERVER):app/
	$(RSYNC) www/*.html www/*.md $(USER)@$(SERVER):www/
	# [ -d assets ] && $(RSYNC) assets/. $(USER)@$(SERVER):assets/.
	[ -d static ] && $(RSYNC) static/. $(USER)@$(SERVER):static/.
	ssh $(USER)@$(SERVER) \
	  psql \
	    -1 \
	    -v name=$(APP) \
	    -v ON_ERROR_STOP=on \
	    -c "\"SET STATEMENT_TIMEOUT TO '10s'\"" \
	    -c "\"\\cd app\"" \
	    -f drop.sql \
	    -f create.sql \
	    -f data.sql \
	    -d \"$(DBCONN)\"
	ssh $(USER)@$(SERVER) \
	  touch app/$(APP).wsgi
	sleep 3
	$(MAKE) check.server.version

# execute some script
%.exe: %.sql
	shopt -s -o errexit
	ssh $(USER)@$(SERVER) \
	  psql \
	    -1 \
	    -v name=$(APP) \
	    -v ON_ERROR_STOP=on \
	    -f app/$*.sql \
	    -d "$(DBCONN)"

%.html: %.md
	pandoc -s -o $@ $<

# check deployed server
APP_API	= $(APP_URL)/api

.PHONY: check.server.version
check.server.version:
	curl -s -i -u $(NOADM) $(APP_API)/version || exit 1

.PHONY: check.server.index
check.server.index:
	curl -s $(APP_URL)/index.md || exit 1

.PHONY: check.server.stats
check.server.stats:
	curl -s -i -u $(ADMIN) $(APP_API)/stats || exit 1

.PHONY: check.server.pytest
check.server.pytest: $(PYTHON_VENV)
	source $(PYTHON_VENV)/bin/activate
	export APP_AUTH="$(ADMIN),$(NOADM)" APP_URL="$(APP_API)"
	$(PYTEST) $(PYTOPT) -v test.py
