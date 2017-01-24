node-web
========

In an attempt to simplify the process of starting up new node.js based projects, there exists two template projects to use as a foundation.  

The two projects are [node-web](https://github.com/KTH/node-web), a web server with express, and [node-api](https://github.com/KTH/node-api), a RESTful api. Both of them use OpenID Connect and/or CAS as a mechanism for authorisation and authentication.  

**The projects can be found here:**
[https://github.com/KTH/node-web](https://github.com/KTH/node-web)
[https://github.com/KTH/node-api](https://github.com/KTH/node-api)

It's important that we try to make changes that affect the template projects in the template projects themselves.

###Where do you keep you secrets?
Secrets during local development are ALWAYS stored in a `.env`-file in the root of your project. This file should be in .gitignore. It needs to contain at least ldap connection URI and password in order for authentication to work properly:

```
LDAP_URI=ldaps://[usertname]@ldap.ref.ug.kth.se
LDAP_PASSWORD=[password]
```

During local development the defaults in serverSettings.js should work fine. If you need to make specific changes for your machine, add these to the `.env`-file. If you want changes that should be used by anyone developing your project, change the default variables in the settings-files.

###How do I use node-web template project for a project of my own?
1. Create a new git repository on github.com/KTH (or other somewhere else).

2. Clone the newly created repository locally by using:

 ```bash
 git clone https://github.com/USER/REPOSITORY.git
 ```

3. Navigate to the cloned project directory

4. Add node-web or node-api as the upstream repository to use:

 ```bash
 git remote add upstream https://github.com/KTH/node-web.git
 ```

5. Fetch the latest changes/branches for the upstream repository (use your KTH login if prompted):

 ```bash
 git fetch upstream
 ```

6. Checkout the branch you want to use:

 ```bash
 git checkout master
 ```

7. Merge the changes from node-api into your cloned repository:

 ```bash
 git merge upstream/master
 ```

8. Solve merge conflicts and commit/push to your cloned repository.

To keep your cloned repository up to date with the upstream repository, just repeat steps 5-7 from above. Make sure to commit and push your existing changes before you merge!

###If your application is going to be proxied
If your application is going to be proxied on www.kth.se/api/your-api-path make sure you set the following paths and properties.

1. Make sure you add the proxy prefix path in your paths in /server/init/routing/paths.js e.g

 ```json
 monitor : {
   uri : '/api/node/_monitor',
   method : 'GET'
 }
 ```

2. Set you basePath property in /swagger.json e.g.

 ```javascript
 "basePath": "/api/node/v1"
 ```

## Starting the server
Always start by installing dependencies:

```bash
$ npm install
```

Then you need to start the server:
```bash
$ npm start
```

This will 

1. run `gulp build:dev` once to build SASS-files, and prepare browser JavaScript files
2. start `nodemon` which triggers restart when server-side files have been updated
3. run `gulp watch` which triggers a rebuild of browser assets when files have been updated

To learn more about the gulp build process, checkout [kth-node-build-commons](https://github.com/KTH/kth-node-build-commons)

## Debugging

### Debugging in VS Code

If you start Mode.js from VS Code you can set breakpoints in your editor. The launch config will look like this:

```json
{
    "type": "node",
    "request": "launch",
    "name": "Launch Program",
    "program": "${workspaceRoot}/app.js",
    "cwd": "${workspaceRoot}",
    "env": {
        "NODE_ENV": "development"
    }
}
```
Setting NODE_ENV is currently required.
