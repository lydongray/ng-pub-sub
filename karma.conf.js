// Karma configuration
// Generated on Fri Apr 15 2016 10:23:58 GMT+1000 (AUS Eastern Standard Time)

module.exports = function(config) {

    var configuration = {

        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: './',


        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['jasmine'],


        // list of files / patterns to load in the browser
        files: [
            'bower_components/angular/angular.js',
            'bower_components/angular-mocks/angular-mocks.js',

            'src/ng-pub-sub.module.js',
            'src/ng-pub-sub.config.js',
            'src/ng-pub-sub.provider.js',

            'tests/unit/specs/user.module.js',
            'tests/unit/specs/user.config.js',
            'tests/unit/specs/user.service.js',
            'tests/unit/specs/user.controller.js',

            'tests/unit/**/*.spec.js',
        ],


        // list of files to exclude
        exclude: [
        ],


        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {
            'src/**/*.js': ['babel']
        },
        babelPreprocessor: {
            options: {
                presets: ['es2015'],
                sourceMap: 'inline'
            },
            filename: function (file) {
                return file.originalPath.replace(/\.js$/, '.es5.js');
            },
            sourceFileName: function (file) {
                return file.originalPath;
            }
        },


        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['mocha'],


        // plugins
        plugins: [
            'karma-jasmine',
            'karma-mocha-reporter',
            'karma-chrome-launcher',
            'karma-firefox-launcher',
            'karma-babel-preprocessor'
        ],


        // reporter options 
        mochaReporter: {
          colors: {
            success: 'blue',
            info: 'bgGreen',
            warning: 'cyan',
            error: 'bgRed'
          }
        },


        // web server port
        port: 9876,


        // enable / disable colors in the output (reporters and logs)
        colors: true,


        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,


        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,


        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: ['Chrome'],


        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: false,


        // Concurrency level
        // how many browser should be started simultaneous
        concurrency: Infinity,
    };

    if (process.env.TRAVIS) {
        // Use Firefox for travis-ci (has better support)
        configuration.browsers = ['Firefox'];
    }

    config.set(configuration)
}
