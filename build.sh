#!/bin/bash

ENV=$1
set -e

function echoYellow() {
  MSG=$1
  printf "\033[1;33m$MSG\033[0m\n"
}

echo
echoYellow "|--------------------------------------------------------|"
echoYellow "| Building the application with Bash and Webpack         |"   
echoYellow "|--------------------------------------------------------|\n"

echoYellow "  1. Copying files"

echoYellow "     -> Create /dist/js/ckeditor folders"
mkdir -p ./dist/js/ckeditor/plugins

echoYellow "     -> Copying ckEditor css files from /node_modules/@kth/kth-ckeditor-build/cssOverrides/ to dist folder"
cp -R ./node_modules/@kth/kth-ckeditor-build/cssOverrides/. ./dist/js/ckeditor

echoYellow "     -> Copying ckEditor custom files from /node_modules/@kth/kth-ckeditor-build/customConfig/customConfig.js to dist folder"
cp -R ./node_modules/@kth/kth-ckeditor-build/customConfig/customConfig.js ./dist/js/ckeditor

echoYellow "     -> Copying ckEditor plugin files from /node_modules/@kth/kth-ckeditor-build/plugins/ to dist folder"
cp -R ./node_modules/@kth/kth-ckeditor-build/plugins/. ./dist/js/ckeditor/plugins

echoYellow "     -> Copying ckEditor plugin files from /node_modules/@kth/kth-ckeditor-build/ckeditor/ to dist folder"
cp -R ./node_modules/@kth/kth-ckeditor-build/ckeditor/. ./dist/js/ckeditor


if [ "$ENV" == "prod" ]; then
  echo
  echoYellow "  2. Bundling the client app into the /dist folder\n"
  WEBPACK_ENV=prod WEBPACK_MODE=build webpack

  echo
  echoYellow "  Done.\n"
fi

if [ "$ENV" == "dev" ]; then
  echo
  echoYellow "  2. Bundling the client app into the /dist folder to list results\n"
  WEBPACK_ENV=dev WEBPACK_MODE=build webpack

  echo
  echoYellow "  3. Running watch on client app. Check /dist for changes\n"
  WEBPACK_ENV=dev WEBPACK_MODE=watch webpack
fi

if [ "$ENV" == "docker" ]; then
  echo
  echoYellow "  2. Bundling the client app into the /dist folder to list results\n"
  WEBPACK_ENV=dev WEBPACK_MODE=build webpack

fi