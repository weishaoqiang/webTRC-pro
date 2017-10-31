var gulp = require('gulp');
var connect = require('gulp-connect');

gulp.task('js', function () {
    gulp.src('./*.js')
       .pipe(gulp.dest('./dist/'));
});

gulp.task('html', function () {
    gulp.src('./index.html')
        .pipe(gulp.dest('./dist'));
});

gulp.task('watch', function () {
    gulp.watch(['./index.html'], ['html']);
    gulp.watch(['./*.js'], ['js']);
});

gulp.task('default', ['html', 'js', 'watch'], function () {
    connect.server({
        root: 'dist',
        https: true,
        port: 3000,
        livereload: true
    });
});