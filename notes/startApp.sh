#!/bin/bash
# start app
# which bash
# chmod 755 startApp.sh
# sed -i -e 's/\r$//' startApp.sh
# ./ startApp.sh
# fuser -k 8092/tcp

echo "starting app..."
cd garrproject/semaphore
rm nohup.out
fuser -k 8092/tcp
nohup http-server -a 130.136.131.42 -p 8092 ./app -s &
echo "...started app"