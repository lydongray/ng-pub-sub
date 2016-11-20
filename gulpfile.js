var gulp = require('gulp');
var dest = gulp.dest;
var karmaServer = require('karma').Server;
var jshint = require('gulp-jshint');
var del = require('del');
var jscs = require('gulp-jscs');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var runSequence = require('run-sequence');
var concat = require('gulp-concat');
var annotate = require('gulp-ng-annotate');
var babel = require('gulp-babel');
var header = require('gulp-header');
var prompt = require('gulp-prompt');
var semver = require('semver');
var jeditor = require("gulp-json-editor");
var pkg = require('./package.json');

var appName = 'ng-pub-sub';
var buildEnv = 'dev';
var root = './';
var outputDist = root + 'dist/';
var newVersion = '';
var paths = {};
var configs = {};

setPaths(buildEnv);
setConfigs();

// Set environment and paths
function setPaths(env) {
    buildEnv = env;
    paths = {
        input: {
            js: {
                all: [
                    root + 'src/ng-pub-sub.module.js', 
                    root + 'src/ng-pub-sub.config.js', 
                    root + 'src/ng-pub-sub.provider.js']
            }
        },
        output: {
            root: root,
            dist: outputDist,
            modules: outputDist + 'modules'
        }
    };
};

// Set configurations
function setConfigs() {
    configs = {
        uglify: {
            mangle: true
        },
        jscs: {
            fix: false
        },
        annotate: {
            add: true
        },
        babel: {
            presets: ['es2015']
        }
    };
};

// Cleans the output (deletes all files)
gulp.task('clean', function () {
    return del([
        paths.output.dist + '*'
    ]);
});

// Bumps the version number for the package.json and bower.json files
gulp.task('bumpVersion', function() {
    return gulp.src('')
        .pipe(prompt.prompt({
            type: 'list',
            name: 'bump',
            message: 'What type of version bump would you like to make?',
            choices: [
                'patch (' + pkg.version + ' --> ' + semver.inc(pkg.version, 'patch') + ')',
                'minor (' + pkg.version + ' --> ' + semver.inc(pkg.version, 'minor') + ')',
                'major (' + pkg.version + ' --> ' + semver.inc(pkg.version, 'major') + ')',
                'none'
            ]
        }, function(res) {
            if(res.bump.match(/^patch/)) {
                newVersion = semver.inc(pkg.version, 'patch');
            } else if(res.bump.match(/^minor/)) {
                newVersion = semver.inc(pkg.version, 'minor');
            } else if(res.bump.match(/^major/)) {
                newVersion = semver.inc(pkg.version, 'major');
            } else {
                newVersion = pkg.version;
            }
        }));
});

// Updates the version in package.json
gulp.task('updatePackage', function() {
    return gulp.src('package.json')
        .pipe(jeditor({
            'version': newVersion
        }))
        .pipe(gulp.dest(paths.output.root))
});

// Updates the version in bower.json
gulp.task('updateBower', function() {
    return gulp.src('bower.json')
        .pipe(jeditor({
            'version': newVersion
        }))
        .pipe(gulp.dest(paths.output.root));
});

// Check for coding mistakes
gulp.task('lint', function () {
    return gulp.src(paths.input.js.all)
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'));
});

// Check for coding standards
gulp.task('jscs', function () {
    return gulp.src(paths.input.js.all)
        .pipe(jscs(configs.jscs))
        //.pipe(dest(paths.input.root)) // Automatically fix mistakes (also set fix=true in config)
        .pipe(jscs.reporter('jscs-stylish'));
});

// Run unit tests
gulp.task('unit-test', function (done) {
    new karmaServer({
        configFile: __dirname + '\\karma.conf.js',
        singleRun: true
    }, done).start();
});

// Build files
gulp.task('build-files', ['clean'], function() {
    var banner = ['/**',
        ' * <%= pkg.name %> - <%= pkg.description %>',
        ' * @version v' + (newVersion ? newVersion : '<%= pkg.version %>'),
        ' * @link <%= pkg.homepage %>',
        ' * @license <%= pkg.license %>',
        ' * @author <%= pkg.author %>',
        ' */',
        ''].join('\n');

    return gulp.src(paths.input.js.all)
        // Output modules
        .pipe(gulp.dest(paths.output.modules))
        // Concat
        .pipe(concat(appName + '.js'))
        // Convert es6 to es5
        .pipe(babel(configs.babel))
        // Annotate
        .pipe(annotate(configs.annotate))
        // Include header
        .pipe(header(banner, { pkg: pkg }))
        // Output
        .pipe(dest(paths.output.dist))
        // Uglify/Minify
        .pipe(uglify(configs.uglify))
        // Include header
        .pipe(header(banner, { pkg: pkg }))
        // Rename to .min.js
        .pipe(rename(appName + '.min.js'))
        // Output
        .pipe(dest(paths.output.dist));
});

// Build 
gulp.task('build', function (done) {
    runSequence('clean', 'bumpVersion', ['updatePackage', 'updateBower', 'lint', 'jscs', 'unit-test'], 'build-files', function () {
        done();
    });
});
