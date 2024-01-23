#!/bin/sh
if [ $NODE_ENV == "development" ] 
then
    echo "development mode running";
    npm install
    npm run start-dev
else
    npm run start
fi