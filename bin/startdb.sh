#!/bin/sh

DB_PATH=/tmp/data

usage() {
  echo "Usage: $0 [-d PATH]"
}

while getopts "d:n:u:p:h" option; do
  case "$option" in
    d) DB_PATH="$OPTARG";;
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

pg_ctl -D "$DB_PATH" status > /dev/null
if [ $? -ne 0 ]; then
  pg_ctl -D "$DB_PATH" -l "$DB_PATH/logfile" start
else
  echo server already started
fi
