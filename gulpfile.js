/**
 * require
 */
const gulp = require('gulp');
const runSequence = require('run-sequence');
runSequence.use(gulp);
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const tsify = require('tsify');

/**
 * Any context
 */
const outputFile = 'main.js';
const distributionDirName = './src/assets/ts_converted';

/**
 * Tasks
 */


gulp.task('build', () => {
    return browserify({
        entries: './src/assets/ts/app.ts'
    })
        .plugin('tsify')
        .transform('babelify')
        .plugin('gasify')
        .bundle()
        .pipe(source(outputFile))
        .pipe(gulp.dest(distributionDirName));

});
