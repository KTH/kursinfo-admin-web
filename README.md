# Welcome to kursinfo-admin-web 👋

![Version](https://img.shields.io/badge/version-2.0.0-blue.svg?cacheSeconds=2592000)
![Prerequisite](https://img.shields.io/badge/node-18-blue.svg)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](#)

## Introduction

The course information project (KIP) is an initiative at KTH that was launched in 2018 to improve the quality and availability of information about KTH:s courses. The background to the project is, among other things, that it was difficult for the student to find information about the courses and even more difficult to compare information about several courses. The reason for the problems is scattered course information in several places and that there is no uniformity or assigned places for the course information. The project takes measures to consolidate course information into two locations and to present the information in a manner that is uniform for KTH. The student should find the right information about the course, depending on their needs. The result of the project is a public course site where the correct course information is collected and presented uniformly. Also, a tool is developed for teachers to enter and publish course information. Eventually, this will lead to the student making better decisions based on their needs, and it will also reduce the burden on teachers and administration regarding questions and support for the student.

Kursinfo-admin-web is a microservice with an administration tool for teachers to enter and publish course information. Teachers can edit the introduction text and choose an image for a course. The tool also provides an entrance to other microservices like course memo och course history.

### 🏠 [Homepage](https://github.com/KTH/kursinfo-admin-web)

## Overview

Firstly, the app displays en entrance page for services to organize information about course. Secondly user can edit a short description about a course and upload a image which will be displayed together with a short description on public pages of microservice `kursinfo-web`

The app consists of several pages:

- Administrate start page with menu and cards to show what can be changed by course coordinators and examiners.
  (requires no api keys, only kopps url)

```
localhost:3000/kursinfoadmin/kurser/kurs/:courseCode
```

- Course introduction text for course information page, which can be edited by course coordinators and examiners.
  (requires only: `API_KEY` kursinfo-api)

```
localhost:3000/kursinfoadmin/kurser/kurs/edit/:courseCode

```

- page to monitor images, if there are any missing files in blob storage or some unused files. _BLOB_SERVICE_SAS_URL_ should include list rights, section "Generate Shared access signature"

```
localhost:3000/kursinfoadmin/kurser/kurs/_monitor_images

```

### Administrate start page

- Menu with navigation links for course information related pages (kursinfo-web, kursinfo-admin-web)
- Cards with navigation buttons leading to editing introduction text, editing course development, and history admin web

### API:s

Application is fetching data from KOPPS-API for:

- Course title
- Introduction text from Kopps

Application is fetching data from kursinfo-api to show:

- Introduction text if it has been edited before and exists in kursinfo-api

#### Use Cache for Kopps API and for kursinfo-web

REDIS_URI used is to cache a response from kopps api because it is used as a start page for other microservices and will be used intensively by user while going from one service to another. Though it should be avoided to cache kursinfo-api, or only for a short time.

### Related projects

- [https://github.com/KTH/kursinfo-web](https://github.com/KTH/kursinfo-web)
- [https://github.com/KTH/kursinfo-api](https://github.com/KTH/kursinfo-api)

We must try to make changes that affect the template projects in the template projects themselves.

## Prerequisites

- node 18

### Blob storage. Generate Shared access signature

_blob container (STORAGE_CONTAINER_NAME) `kursinfo-image-container`_

While images uploads directly to a blob container located in a cloud in the storage account, f.e., `kursinfostoragestage`, the name of uploaded image will be saved in `kursinfo-api`.
To connect to blob storage, the Shared access signature is used to limit what can be done by using this signature, f.e., only read, or write and which services. In stage environment keys were generated on base of key2.
For each service generated a separate Shared access signature and saved(f.e., SAS-REF-blob-service-sas-url) in standard key vault.

It requires package `"@azure/storage-blob": "^12.2.1"`. Further to parse a file between client and server, you need to have npm package `body-parser`. More details in `server/blobStorage.js`.

#### How to generate a Shared access signature

To generate it, go to a storage account, f.e., `kursinfostoragestage`, choose Shared Access signature and choose:

- Allowed services: _Blob_
- Allowed resource types: _Container, Object_
- Allowed permissions: _Read, Write, Create, List_
- Start and expiry date/time
- HTTPS only
- Signing key: key1 or key2

After a generation of a key, copy **Blob service SAS URL** and save it in a standard key vault and set **Expiration Date**.
Later you will use it as a _BLOB_SERVICE_SAS_URL_ in secrets together with a name of blob container STORAGE_CONTAINER_NAME

### Secrets for Development

Secrets during local development are ALWAYS stored in a `.env`-file in the root of your project.

IMPORTANT: In Prod env, save URL:s in docker file but secrets in secrets.env

```
API_KEY=[key you specified in kursinfo-api for this service]
KOPPS_URI=https://[kopps api]/api/kopps/v2/?defaultTimeout=60000
SESSION_SECRET=[something random]
SESSION_KEY=[f.e. kursinfo-admin-web.sid]
OIDC_APPLICATION_ID=<FROM ADFS>
OIDC_CLIENT_SECRET=<FROM ADFS>
OIDC_TOKEN_SECRET=<Random string>
OIDC_CONFIGURATION_URL=<not needed if localhost>
OIDC_CALLBACK_URL=<not needed if localhost>
OIDC_CALLBACK_SILENT_URL=<not needed if localhost>
OIDC_CALLBACK_LOGOUT_URL=<not needed if localhost>
REDIS_URI=[connection string to redis]
/*If you want to start your server on another port, add the following two variables, else use default ones from serversettings.js*/
SERVER_PORT=[your port for the server]
SERVER_HOST_URL=http://localhost:[SERVER_PORT]
BLOB_SERVICE_SAS_URL=https://[blob storage address]/?sv=[date]&ss=b&srt=o&sp=rwcx&se=[date]&st=[date]&spr=https&sig=[generated signature]
STORAGE_CONTAINER_NAME=kursinfo-image-container
```

These settings are also available in an `env.in` file.

### Install

First time you might need to use options `--ignore-scripts` because of npm resolutions:

```sh
npm install --ignore-scripts
```

or

```sh
npm install

```

You might need to install as well:

```sh
npm install cross-env
npm install concurrently
```

### Usage

Start the service on [localhost:3000/kursinfoadmin/kurser/kurs/:courseCode](http://localhost:3000/kursinfoadmin/kurser/kurs/:courseCode).

```sh
npm run start-dev
```

### Debug in Visual Studio Code

It's possible to use debugging options available in Visual Studio Code
Add to .vscode file launch.json:

- _Microsoft_

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug kursinfo-admin-web",
      "program": "${workspaceFolder}\\app.js",
      "envFile": "${workspaceFolder}\\.env",
      "env": {
        "NODE_ENV": "development"
      }
    }
  ]
}
```

- _Mac, Unix and so on_

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug kursinfo-admin-web",
      "program": "${workspaceFolder}/app.js",
      "envFile": "${workspaceFolder}/.env",
      "env": {
        "NODE_ENV": "development"
      }
    }
  ]
}
```

## Run tests

```sh
npm run test
```

## Use 🐳

`API_URI` in `docker-compose.yml` is configured for a local kursinfo-api, and might as well be changed to kursinfo-api in ref.

```sh
docker-compose up
```

## Editor CKEDITOR and gulp

@kth/kth-ckeditor-build package is used for editor. It uses gulp file to be built in /dist folder.

## Author

👤 **KTH**

- Website: https://kth.github.io/
- Github: [@KTH](https://github.com/KTH)
