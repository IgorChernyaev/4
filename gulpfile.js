var gulp = require("gulp");
var rename = require("gulp-rename");
var rimraf = require("rimraf");
var serve = require("gulp-serve");

var sass = require("gulp-sass");
var autoprefixer = require("gulp-autoprefixer");
var cleanCSS = require("gulp-clean-css");

var imagemin = require("gulp-imagemin");

var paths = {
    src: {
        html: "src/index.html",
        sass: "src/stylesheets/application.scss",
        images: "src/images/**/**"
    },
    watch: {
        html: "src/index.html",
        sass: "src/stylesheets/**/**",
        images: "src/images/**/**"
    },
    dist: {
        html: "dist",
        sass: "dist",
        images: "dist/images"
    }
};


gulp.task("html", function () {
    return gulp.src(paths.src.html)
        .pipe(gulp.dest(paths.dist.html));
});
gulp.task("html:watch", function () {
    gulp.watch(paths.watch.html, ["html"]);
});

gulp.task("sass", function () {
    return gulp.src(paths.src.sass)
        .pipe(sass().on("error", sass.logError))
        .pipe(rename("application.css"))
        .pipe(gulp.dest(paths.dist.sass));
});
gulp.task("sass:watch", function () {
    gulp.watch(paths.watch.sass, ["sass"]);
});
gulp.task("sass:prod", function () {
    return gulp.src(paths.src.sass)
        .pipe(sass().on("error", sass.logError))
        .pipe(autoprefixer({ browsers: ["last 3 versions"], cascade: false }))
        .pipe(cleanCSS({ compatibility: "*" }))
        .pipe(rename("application.min.css"))
        .pipe(gulp.dest(paths.dist.sass));
});

gulp.task("images", function () {
    return gulp.src(paths.src.images)
        .pipe(imagemin([
            imagemin.jpegtran({ progressive: true }),
            imagemin.optipng({ optimizationLevel: 0 }),
        ]))
        .pipe(gulp.dest(paths.dist.images));
});
gulp.task("images:watch", function () {
    gulp.watch(paths.watch.images, ["images"]);
});

gulp.task("serve", serve("dist"));

gulp.task("clean", function (cb) {
    return rimraf("dist", cb);
});

gulp.task("watch", ["html:watch", "sass:watch", "images:watch"]);
gulp.task("build", ["html", "sass", "images"]);
gulp.task("default", ["build", "watch", "serve"]);
