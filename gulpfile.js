const fs = require('fs');
const gulp = require('gulp');
const babel = require('gulp-babel');
const eslint = require('gulp-eslint');
const sourcemaps = require('gulp-sourcemaps');
const plumber = require('gulp-plumber');
const newer = require('gulp-newer');
const gutil = require('gulp-util');
const watch = require('gulp-watch');
const nodemon = require('nodemon');
const del = require('del');

const paths = {
  srcFiles: 'src/**/*',
  srcRootFromDest: '../src',
  dest: 'build',
  destScript: 'build/index.js',
};

gulp.task('clean', () =>
  del.sync('build')
);

gulp.task('eslint', () =>
  gulp.src([paths.srcFiles])
    .pipe(newer(paths.dest))
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failOnError())
);

gulp.task('build', ['eslint'], () =>
  gulp.src([paths.srcFiles])
    .pipe(newer(paths.dest))
    .pipe(plumber({
      errorHandler(err) {
        gutil.log(err.stack);
      },
    }))
    .pipe(sourcemaps.init())
    .pipe(babel())
    .pipe(sourcemaps.write('./', { sourceRoot: paths.srcRootFromDest }))
    .pipe(gulp.dest(paths.dest))
);

gulp.task('watch', () => {
  const builtScriptWatcher = watch(paths.destScript, () => {
    builtScriptWatcher.close();
    const daemon = nodemon({
      script: paths.destScript,
      watch: paths.dest,
      env: { NODE_ENV: 'development' },
      restartable: 'r',
      delay: '1000',
      quiet: true,
      runOnChangeOnly: true,
    });
    process.once('exit', () => daemon.emit('exit'));
    process.once('SIGINT', () => process.exit(0));
  });

  watch(paths.srcFiles, () => gulp.start('build'));

  gulp.start('build');
});

gulp.task('dist', ['clean', 'build']);

gulp.task('default', ['clean', 'watch']);
