#!/usr/bin/env bash

APPLICATION_NAME=node-web

# TODO Should LOG_DIR be handled like in the start.sh file depending on env?
LOG_DIR=/var/log/$APPLICATION_NAME
PIDFILE=$LOG_DIR/RUNNING_PID

# check if running
if [ -f $PIDFILE ]; then
  PIDS=$(<$PIDFILE)

  if [ -z "$PIDS" ]; then
    echo "$APPLICATION_NAME not running"
    return 0
  fi
  printf "%-50s%s" "Stopping $APPLICATION_NAME: " ''
  rm -f $PIDFILE
  kill -9 $PIDS
fi
