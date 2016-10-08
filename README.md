node-web
========

In an attempt to simplify the process of starting up new node.js based projects, there exists two template projects to use as a foundation.  

The two projects are [node-web](https://github.com/KTH/node-web), a web server with express, and [node-api](https://github.com/KTH/node-api), a RESTful api. Both of them use OpenID Connect and/or CAS as a mechanism for authorisation and authentication.  

**The projects can be found here:**
[https://github.com/KTH/node-web](https://github.com/KTH/node-web)
[https://github.com/KTH/node-api](https://github.com/KTH/node-api)

It's important that we try to make changes that affect the template projects in the template projects themselves.

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
The easiest way to start the application is to, in the root of the application, run
```bash
./start.sh
```
If that doesn't work, running the following does the same:
```bash
npm run installAndStart
```
That installs all the dependencies and performns some tasks before starting the server. This is mostly good, but can take unnecessary time. To start the server without running those tasks, run:
```bash
npm start
```
## Debugging the server
To debug the node server, run the following:
```bash
npm run debug
```
That starts two browser windows, one for running the application and one for debugging the node server

##Debugging in mobile browsers
To be able to view firebug lite, append ?debug to any url like so:
```bash
http://localhost:3003/node?debug
```
