#!/bin/bash

ENV=$1

function echoYellow() {
  MSG=$1
  printf "\033[1;33m$MSG\033[0m\n"
}

echo
echoYellow "|--------------------------------------------------------|"
echoYellow "|    Building the Docker image for development env       |"   
echoYellow "|--------------------------------------------------------|\n"

IMAGE_NAME="kursinfo-admin-web-image"


if [ "$ENV" == "dev" ]; then

  echo
  echoYellow "  1. Stop previous Docker image: a name tag is $IMAGE_NAME\n"
  docker stop "$IMAGE_NAME"

  echo
  echoYellow "  2. Remove previous Docker image: a name tag is $IMAGE_NAME\n"
  docker rmi "$IMAGE_NAME"

  echo
  echoYellow "  3. Build Docker image: a name tag is $IMAGE_NAME\n"
  docker build -f Dockerfile -t "$IMAGE_NAME" .

  echo
  echoYellow "  4. List images\n"
  docker images
fi