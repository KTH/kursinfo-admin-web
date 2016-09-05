#!/bin/bash

LOG_DIR=logs
PROJECT=node-web

if [ "$1" = "ref" ] ; then
  LOG_DIR=/var/log/$PROJECT
fi

if [ "$1" = "prod" ] ; then
  LOG_DIR=/var/log/$PROJECT
fi

SYSTEM_LOG_FILE=$PROJECT.log
SYSTEM_LOG=$LOG_DIR/$SYSTEM_LOG_FILE
PIDFILE=$LOG_DIR/RUNNING_PID

export NODE_PATH=`pwd`

# Check parameter for type of env
if [ "$1" = "prod" ]; then
  NODE_ENV=production node app.js > $SYSTEM_LOG 2>&1 &
  echo $! > $PIDFILE
elif [ "$1" = "ref" ]; then
  NODE_ENV=ref node app.js > $SYSTEM_LOG 2>&1 &
  echo $! > $PIDFILE
else
  npm run installAndStart
fi
