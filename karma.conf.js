
module.exports = config => {

  config.set({

    frameworks: ['browserify', 'mocha'],

    plugins: [
      'karma-browserify',
      'karma-jsdom-launcher',
      'karma-mocha',
      'karma-mocha-reporter',
      'karma-coverage'
    ],

    files: [
      'node_modules/babel-polyfill/dist/polyfill.js',
      {
        pattern: 'test/**/*.test.js',
        watched: false, included: true, served: true
      },
      {
        pattern: 'src/**/*.js',
        watched: false, included: true, served: true
      }
    ],

    preprocessors: {
      'test/**/*.test.js': ['browserify'],
      'src/**/*.js': ['browserify']
    },

    browserify: {
      debug: true,
      transform: [
        ['babelify', {
          presets: ['es2015', 'stage-2'],
          plugins: [
            ['transform-react-jsx', { pragma: 'h' }]
          ],
          sourceMaps: 'inline'
        }],
        ['browserify-babel-istanbul', {
        }]
      ]
    },

    reporters: ['mocha'],

    mochaReporter: { output: 'autowatch' },

    port: 9876,

    autoWatchBatchDelay: 0,

    logLevel: config.LOG_ERROR,

    browsers: ['jsdom']

  })

}
