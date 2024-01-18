#
# Project Settings
#

APP	= crousteam

USER	= $(APP)
HOST	= mobapp.minesparis.psl.eu
SERVER  = mobapp-srv.minesparis.psl.eu
APP_URL	= https://$(APP).$(HOST)

# extract first admin and noadm accounts
ADMIN   = $(shell grep -v '^#' test_users.in | grep ' TRUE' | head -1 | tr ' ' ':' | cut -d: -f1,2)
NOADM   = $(shell grep -v '^#' test_users.in | grep ' FALSE' | head -1 | tr ' ' ':' | cut -d: -f1,2)

DBCONN	= host=pagode user=$(APP) dbname=$(APP)
