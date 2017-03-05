module.exports = function (config) {
  'use strict';

  config.set({
    basePath: './',
    frameworks: ["jasmine"],
    // list of files / patterns to load in the browser
    files: [
      'node_modules/core-js/client/core.js',
      'node_modules/zone.js/dist/zone.js',
      'node_modules/zone.js/dist/long-stack-trace-zone.js',
      'node_modules/zone.js/dist/proxy.js',
      'node_modules/zone.js/dist/sync-test.js',
      'node_modules/zone.js/dist/jasmine-patch.js',
      'node_modules/zone.js/dist/async-test.js',
      'node_modules/zone.js/dist/fake-async-test.js',
      { pattern: 'restangular.spec.ts', watched: false }
    ],

    // list of files / patterns to exclude
    exclude: [],

    preprocessors: {
      'restangular.spec.ts': ['webpack', 'sourcemap']
    },


    webpackServer: {
      noInfo: true
      //progress:false,
      //stats: false,
      //debug:false
    },

    // web server port
    port: 9876,

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,

    browsers: [
      //"Firefox",
      //"Chrome",
      //"IE",
      "PhantomJS"
    ],

    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: true,

    reporters: ['progress', 'coverage'],

    webpack: {
      resolve: {
        extensions: ['', '.ts', '.js']
      },
      module: {
        loaders: [
          { test: /\.ts$/, loader: 'awesome-typescript-loader' }
        ],
        postLoaders: [
          // instrument only testing sources with Istanbul
          {
            test: /\.ts$/,
            exclude: /(node_modules|resources\/js\/vendor)/,
            // include: path.resolve('src/'),
            loader: 'istanbul-instrumenter-loader'
          }
        ]
      },
      stats: {
        colors: true,
        reasons: true
      },
      debug: false,
      devtool: 'inline-source-map'
    }
  });
};
