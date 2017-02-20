var gulp       = require('gulp'),
    apidoc = require('gulp-apidoc');

gulp.task('apidoc', function(done){
    apidoc({
        src: "./src/controller/",
        dest: "./doc/",
        config:'./'
    },done);
});

