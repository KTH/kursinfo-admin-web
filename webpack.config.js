/* eslint-disable import/no-extraneous-dependencies */

// @ts-check

const path = require('path')

const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const TerserPlugin = require('terser-webpack-plugin')

//
// Possible problem:
// - If "entry" contains SCSS-files, an empty JS file is created besides the CSS output
// - https://github.com/webpack-contrib/mini-css-extract-plugin/issues/151
// - https://github.com/webpack/webpack/issues/11671
// - https://github.com/webpack/webpack/issues/7300
//
// Current solution (only if needed):
// - Run "npm i -D webpack-remove-empty-scripts"
// - Include the following, here:
// const RemovePlugin = require('webpack-remove-empty-scripts')
//

//
// Possible problem:
// - We can't use globs (e.g. "./public/js/app/*.{js,jsx}") in "entry"
//
// Current solution (only if needed):
// - Ensure unique basenames (or maybe use subDir)
// - Add "...composeEntriesFromGlob(pattern)" as entry-point
// - Run "npm i -D fast-glob"
// - Include the following, here:
// const FastGlob = require('fast-glob')
//

// const BabelConfig = require('./.babelrc.json')
const { babel: BabelConfig } = require('./package.json')

process.env.NODE_ENV = 'development'
const { uri: PROXY_PREFIX_URI } = require('./config/commonSettings').proxyPrefixPath
// const PROXY_PREFIX_URI = '/node'

const ENV_IS_DEV = ['dev', 'development'].includes(process.env.WEBPACK_ENV)
const WATCH_IS_ON = ['watch'].includes(process.env.WEBPACK_MODE)

// eslint-disable-next-line no-unused-vars
function composeEntriesFromGlob(pattern) {
  // @ts-ignore
  // eslint-disable-next-line no-undef
  const matches = FastGlob.sync(pattern, { onlyFiles: true, cwd: __dirname, objectMode: true })
  const result = {}
  matches.forEach(item => {
    result[item.name.split('.')[0]] = item.path
  })
  return result
}

function composePublicPathString(...subDirParts) {
  const allParts = [
    ENV_IS_DEV ? `http://localhost:3000` : '',
    PROXY_PREFIX_URI,
    ...subDirParts.filter(text => typeof text === 'string' && text !== ''),
  ]
  return allParts.map(text => text.replace(/^\/|\/$/g, '')).join('/') + '/'
}

function getTransformationRules({ contextIsNode, subDir = null }) {
  const MAGIC_EXTENSIONS_IF_OMITTED_WITH_IMPORT = ['.js', '.jsx', '.json']
  const ALLOW_MIX_OF_CJS_AND_ESM_IMPORTS = { sourceType: 'unambiguous' }

  // @ts-ignore
  // eslint-disable-next-line no-undef
  const AVOID_EMPTY_JS_FILES_ON_SCSS_ENTRYPOINTS = typeof RemovePlugin === 'undefined' ? [] : [new RemovePlugin()]

  return {
    plugins: [...AVOID_EMPTY_JS_FILES_ON_SCSS_ENTRYPOINTS, new MiniCssExtractPlugin()],
    resolve: {
      extensions: MAGIC_EXTENSIONS_IF_OMITTED_WITH_IMPORT,
    },
    target: contextIsNode ? 'node' : 'browserslist:> 0.25%, not dead',
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: { ...BabelConfig, ...ALLOW_MIX_OF_CJS_AND_ESM_IMPORTS },
          },
        },
        {
          test: /\.s[ac]ss$/i,
          use: contextIsNode
            ? 'null-loader'
            : [
                MiniCssExtractPlugin.loader,
                {
                  loader: 'css-loader',
                  options: {
                    esModule: false,
                  },
                },
                'sass-loader',
              ],
        },
        {
          test: /\.(png|jpe?g|gif|svg)$/i,
          use: contextIsNode
            ? 'null-loader'
            : [
                {
                  loader: 'file-loader',
                  options: {
                    publicPath: composePublicPathString('static', subDir),
                    name: '[name].[hash:8].[ext]',
                  },
                },
              ],
        },
      ],
    },
  }
}

function getOutputOptions({ contextIsNode, subDir = null }) {
  const OUTPUT_LICENSE_FILES = false
  const BUNDLES_CAN_BE_IMPORTED_ON_SERVER_SIDE = contextIsNode ? { library: { type: 'commonjs2' } } : null

  // There are many different types of source-maps in Webpack
  // (see https://webpack.js.org/configuration/devtool)

  // Tested settings:

  // const DEV_SOURCE_MAP_TYPE = 'eval'
  // - comes w/o *.map files and still small bundle (app.js has 2.6 MB)
  // - code view with many Webpack annotations when debugging in browser
  // - first build-dev (i.e. with empty cache) took 17 seconds

  // const DEV_SOURCE_MAP_TYPE = 'eval-cheap-module-source-map'
  // - comes w/o *.map files, has bigger bundles instead (app.js has 6.0 MB)
  // - code view with many Webpack annotations when debugging in browser
  // - first build-dev (i.e. with empty cache) took 13 seconds

  const DEV_SOURCE_MAP_TYPE = 'source-map'
  // - comes with *.map files (app.js has 2.5 MB)
  // - full code view when debugging in browser
  // - first build-dev (i.e. with empty cache) took 18 seconds

  // const DEV_SOURCE_MAP_TYPE = 'inline-source-map'
  // - comes w/o *.map files, has bigger bundles instead (app.js has 6.1 MB)
  // - full code view when debugging in browser
  // - first build-dev (i.e. with empty cache) took 22 seconds

  return {
    optimization: ENV_IS_DEV
      ? undefined
      : {
          minimizer: [new TerserPlugin({ extractComments: OUTPUT_LICENSE_FILES })],
        },
    output: {
      filename: '[name].js',
      path: path.resolve(__dirname, 'dist', subDir || ''),
      publicPath: composePublicPathString('static', subDir),
      ...BUNDLES_CAN_BE_IMPORTED_ON_SERVER_SIDE,
    },
    devtool: ENV_IS_DEV ? DEV_SOURCE_MAP_TYPE : undefined,
  }
}

function getWatchOptions() {
  return WATCH_IS_ON
    ? {
        watch: true,
        watchOptions: {
          aggregateTimeout: 3000,
          ignored: /\bnode_modules\b/,
        },
      }
    : {
        watch: false,
      }
}

function getConsoleLogOptions({ contextIsNode }) {
  return {
    performance: {
      hints: contextIsNode || ENV_IS_DEV ? false : 'warning',
    },
    stats: {
      all: false,
      colors: true,

      errors: true,
      errorDetails: 'auto',
      warnings: true,

      publicPath: !WATCH_IS_ON,
      assets: !WATCH_IS_ON,

      builtAt: true,
      version: true,
      timings: true,
    },
  }
}

function getCacheOptions({ contextIsNode }) {
  const IGNORE_CACHE_ON_CHANGED_WEBPACK_CONFIG = { config: [__filename] }

  return ENV_IS_DEV
    ? {
        cache: {
          name: contextIsNode ? 'node' : 'browser',
          type: 'filesystem',
          buildDependencies: { ...IGNORE_CACHE_ON_CHANGED_WEBPACK_CONFIG },
        },
      }
    : null
}

module.exports = [
  {
    entry: {
      'ssr-app': './public/js/app/ssr-app.js',
    },

    mode: ENV_IS_DEV ? 'development' : 'production',
    ...getTransformationRules({ contextIsNode: true }),
    ...getOutputOptions({ contextIsNode: true }),

    ...getWatchOptions(),
    ...getConsoleLogOptions({ contextIsNode: true }),
    ...getCacheOptions({ contextIsNode: true }),
  },
  {
    entry: {
      vendor: './public/js/vendor.js',
      app: './public/js/app/app.jsx',
    },

    mode: ENV_IS_DEV ? 'development' : 'production',
    ...getTransformationRules({ contextIsNode: false }),
    ...getOutputOptions({ contextIsNode: false }),

    ...getWatchOptions(),
    ...getConsoleLogOptions({ contextIsNode: false }),
    ...getCacheOptions({ contextIsNode: false }),
  },
]
