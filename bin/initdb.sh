#!/bin/sh

DB_PATH=/tmp/data
DB_NAME=testdb
DB_USER=testuser
DB_PASS=testpassword

usage() {
  echo "Usage: $0 [-d PATH] [-n NAME] [-u USER] [-p PASS]"
}

while getopts "d:n:u:p:h" option; do
  case "$option" in
    d) DB_PATH="$OPTARG";;
    n) DB_NAME="$OPTARG";;
    u) DB_USER="$OPTARG";;
    p) DB_PASS="$OPTARG";;
    h) usage
       exit 0
       ;;
    :) echo "Error: -$option requires an argument"
       usage
       exit 1
       ;;
    ?) echo "Error: unknown option -$option"
       usage
       exit 1
       ;;
  esac
done

mkdir -p "$DB_PATH"
initdb "$DB_PATH"
pg_ctl -D "$DB_PATH" -l "$DB_PATH/logfile" start
createdb testdb
cat <<EOF | psql "$DB_NAME"
  CREATE USER $DB_USER WITH PASSWORD '$DB_PASS';
  GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;
EOF
pg_ctl -D "$DB_PATH" stop
