FROM kthse/kth-nodejs-web:2.0-alpine

MAINTAINER KTH Webb "cortina.developers@kth.se"

RUN mkdir -p /npm && \
    mkdir -p /application

# We do this to avoid npm install when we're only changing code
WORKDIR /npm
COPY ["package.json", "package.json"]
RUN npm install --production --no-optional

# Add the code and copy over the node_modules-catalog
WORKDIR /application
RUN cp -a /npm/node_modules /application

# Copy files used by Gulp.
COPY ["config", "config"]
COPY ["config/secretSettings.js", "config/localSettings.js"]
COPY ["public", "public"]
COPY ["gulpfile.js", "gulpfile.js"]
COPY ["package.json", "package.json"]
RUN npm run docker

# Copy source files, so changes does not trigger gulp.
COPY ["server", "server"]
COPY ["app.js", "app.js"]

ENV NODE_PATH /application

EXPOSE 3000

ENTRYPOINT ["node", "app.js"]
