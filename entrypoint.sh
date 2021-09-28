#!/bin/sh -l

mkdir app
cp -r /github/app .
cp --parents $INPUT_ZIP app

cd app

npm install
node index.js