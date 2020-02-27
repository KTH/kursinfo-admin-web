# Welcome to kursinfo-admin-web 👋

![Version](https://img.shields.io/badge/version-2.0.0-blue.svg?cacheSeconds=2592000)
![Prerequisite](https://img.shields.io/badge/node-8.12.0-blue.svg)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](#)

## Introduction

The course information project (KIP) is an initiative at KTH that was launched in 2018 to improve the quality and availability of information about KTH:s courses. The background to the project is, among other things, that it was difficult for the student to find information about the courses and even more difficult to compare information about several courses. The reason for the problems is scattered course information in several places and that there is no uniformity or assigned places for the course information. The project takes measures to consolidate course information into two locations and to present the information in a manner that is uniform for KTH. The student should find the right information about the course, depending on their needs. The result of the project is a public course site where the correct course information is collected and presented uniformly. Also, a tool is developed for teachers to enter and publish course information. Eventually, this will lead to the student making better decisions based on their needs, and it will also reduce the burden on teachers and administration regarding questions and support for the student.

Kursinfo-admin-web is a microservice with an administration tool for teachers to enter and publish course information. Teachers can edit the introduction text and choose an image for a course. The tool also provides an entrance to other microservices like course memo och course history.

### 🏠 [Homepage](https://github.com/KTH/kursinfo-admin-web)

## Overview

The app displays course analysis and course data published by course coordinators sorted by years. Prospective, current, and previous students can use the information for selecting courses or follow up on previous course evaluations. Teachers, course coordinators, examiners, etc. can use the app as a tool for course development.

The app consists of two parts:

- Administrate start page with menu and cards to show what can be changed by course responsibles and examiners.
- Course introduction text for course information page, which can be edited by course responsibles and examiners.

### Administrate start page

- Menu with navigation links for course information related pages (kursinfo-web, kursinfo-admin-web)
- Cards with navigation buttons leading to editing introduction text, editing course development, and history admin web

### API:s

Application is fetching data from _KOPPS-API_ for:

- Course title
- Introduction text from Kopps

Application is fetching data from _kursinfo-api_ to show:

- Introduction text if it has been edited before and exists in kursinfo-api

#### Use cache for kopps API and for kursinfo-web

_REDIS_URI_ used is to cache a response from kopps api because it is used as a start page for other microservices and will be used intensively by user while going from one sesrvice to another.

### Related projects

- [https://github.com/KTH/kursinfo-web](https://github.com/KTH/kursinfo-web)
- [https://github.com/KTH/kursinfo-api](https://github.com/KTH/kursinfo-api)

We must try to make changes that affect the template projects in the template projects themselves.

## Prerequisites

- node 8.12.0

### Secrets for Development

Secrets during local development are ALWAYS stored in a `.env`-file in the root of your project. This file should be in .gitignore. It needs to contain at least ldap connection URI and password in order for authentication to work properly.

```
API_KEY=[key you specified in kursinfo-api for this service]
KURSUTVECKLING_API_KEY=[secret key to connect to kursutveckling-api]
KOPPS_URI=https://api-r.referens.sys.kth.se/api/kopps/v2/?defaultTimeout=60000
SESSION_SECRET=[something random]
SESSION_KEY=kursinfo-admin-web.sid
LDAP_BASE=OU=UG,DC=ref,DC=ug,DC=kth,DC=se
LDAP_URI=ldaps://[find in gsv-key vault]@[ref].ug.kth.se@ldap.[ref].ug.kth.se
LDAP_PASSWORD=[password]
REDIS_URI=[connection string to redis]
/*If you want to start your server on another port, add the following two variables, else use default ones from serversettings.js*/
SERVER_PORT=[your port for the server]
SERVER_HOST_URL=http://localhost:[SERVER_PORT]
```

These settings are also available in an `env.in` file.

## Install

```sh
npm install
```

## Usage

```sh
npm run start-dev
```

## Run tests

```sh
npm run test
```

## Author

👤 **KTH**

- Website: https://kth.github.io/
- Github: [@KTH](https://github.com/KTH)
