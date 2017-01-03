FROM kthse/kth-nodejs-web:2.0-alpine

MAINTAINER KTH Webb "cortina.developers@kth.se"

RUN mkdir -p /npm   && \
    mkdir -p /application


# We do this to avoid npm install when we're only changing code
WORKDIR /npm

COPY ["package.json", "package.json"]

RUN npm install

# Add the code and copy over the node_modules

WORKDIR /application
COPY [".", "."]

RUN cp -a /npm/node_modules /application && \
    cp -a /application/config/secretSettings.js /application/config/localSettings.js

RUN npm run vendorProd && \
    npm run webpackProd && \
    npm run postinstall

# To be removed when SASS does not transpile inside the image.
RUN apk del g++ python make

ENV NODE_PATH /application

EXPOSE 3000

ENTRYPOINT ["node", "app.js"]
