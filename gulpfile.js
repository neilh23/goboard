var gulp = require("gulp");
var uglify = require("gulp-uglify");
var babel = require("gulp-babel");
gulp.task("default", function () {
  return gulp.src("src/*.js")
    .pipe(babel())
    // .pipe(uglify({mangle: false}))
    .pipe(gulp.dest("dist"))
    ;
});
gulp.task("watch", function(){
    gulp.watch('src/*.js', ['default'])
});
