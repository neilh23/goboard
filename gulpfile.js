var gulp = require("gulp");
var uglify = require("gulp-uglify");
var babel = require("gulp-babel");
var concat = require("gulp-concat");
var connect = require("gulp-connect");
var sourcemaps = require("gulp-sourcemaps");

gulp.task("rebuild", function () {
  return gulp.src([ "src/**/*.js" ], { base: "src" })
    .pipe(sourcemaps.init())
    .pipe(concat("goboard-all.js"))
    .pipe(babel())
    // .pipe(uglify({mangle: false})) - currently throws an exception!
    .pipe(uglify())
    .pipe(sourcemaps.write({includeContent: false, sourceRoot: '/src/'}))
    .pipe(gulp.dest("dist"))
    ;
});
gulp.task("watch", function(){
    gulp.watch('src/**/*.js', ['rebuild'])
});
gulp.task("serve", function(){ connect.server({port: 9000}); });

gulp.task("default", [ 'rebuild', 'serve', 'watch' ]);
