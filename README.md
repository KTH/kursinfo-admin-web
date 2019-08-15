kursinfo-admin-web
========

Infenojs app using mobx and gulp.

This page displays course analysis and course data published by course responsibles sorted by years. Prospective, current and previous students can use the information for selecting courses or follow up on previous course evaluations. Teachers, course responsibles, examiners etc. can use the page as a tool for course development.
Consist of two part:
1) Start page with menu and cards to show what can be changed by course responsibles and examiners.
2) Course introduction text for course information page which can be edited by course responsibles and examiners

Displays:
### Administrate start page ###
- Meny with navigation links for course information related pages (kursinfo-web, kursinfo-admin-web)
- Cards with navigation buttons leading to editing introduction text, editing course development and history admin web.

Application is fetching data from KOPPS-API for:
1. Course title
2. Introduction text from kopps

Application is fetching data from kursinfo-api to show:
1. Introduction text if it was edited before and exists in kursinfo-api

Web pages is public for everyone. 

**Related projects can be found here:**
[https://github.com/KTH/kursinfo-web](https://github.com/KTH/kursinfo-web)
[https://github.com/KTH/kursinfo-api](https://github.com/KTH/kursinfo-api)

It's important that we try to make changes that affect the template projects in the template projects themselves.

###Where do you keep you secrets?
Secrets during local development are ALWAYS stored in a `.env`-file in the root of your project. This file should be in .gitignore. It needs to contain at least ldap connection URI and password in order for authentication to work properly:

```
API_URI=[https://api-r.referens.sys.kth.se/api/kursutveckling]
API_KEY=[password the same as in api itself]
KOPPS_URI=[https://api-r.referens.sys.kth.se/api/kopps/v2/]
KURSPLAN_
SESSION_SECRET=[session secret]
SESSION_KEY=kutv.sid
REDIS_URI=[redis azure connection string]
```

If you want to add authorization:
```
LDAP_BASE=[OU=UG,DC=ref,DC=ug,DC=kth,DC=se]
LDAP_URI=ldaps://[usertname]@ldap.ref.ug.kth.se
LDAP_PASSWORD=[password]
```
