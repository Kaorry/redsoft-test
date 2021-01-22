const gulp = require("gulp");
const plumber = require("gulp-plumber");
const sourcemap = require("gulp-sourcemaps");
const sass = require("gulp-sass");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const csso = require("gulp-csso");
const sync = require("browser-sync").create();
const rename = require("gulp-rename");
const del = require("del");
const terser = require("gulp-terser");

// Styles

const styles = () => {
  return gulp.src("source/sass/style.scss")
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(csso())
    .pipe(rename("styles.min.css"))
    .pipe(sourcemap.write("."))
    .pipe(gulp.dest("build/css"))
    .pipe(sync.stream());
}

exports.styles = styles;

// JS

const scripts = () => {
  return gulp.src("source/js/script.js")
    .pipe(sourcemap.init())
    .pipe(terser())
    .pipe(sourcemap.write("."))
    .pipe(gulp.dest("build/js"))
    .pipe(sync.stream());
}

exports.scripts = scripts;

// Image

const images = () => {
  return gulp.src("source/img/**/*.{jpg,png,svg}")
    .pipe(gulp.dest('build/img'));
};

exports.images = images;

// Copy

const copy = () => {
  return gulp.src([
      "source/fonts/**/*.{woff,woff2}",
      "source/*.ico",
      "source/*.html",
    ], {
      base: "source",
    })
    .pipe(gulp.dest("build"));
};

exports.copy = copy;

// Clean

const clean = () => {
  return del("build");
};

exports.clean = clean;

// Sync reload

const reload = (done) => {
  sync.reload();
  done();
};

exports.reload = reload;

// Build

const build = gulp.series(
  clean,
  images,
  copy,
  styles,
  scripts,
);

exports.build = build;

// Server

const server = (done) => {
  sync.init({
    server: {
      baseDir: 'build'
    },
    cors: true,
    notify: false,
    ui: false,
    ghostMode: false
  });
  done();
}

exports.server = server;

// Watcher

const watcher = () => {
  gulp.watch("source/sass/**/*.scss", gulp.series("styles"));
  gulp.watch("source/js/**/*.js", gulp.series("scripts"));
  gulp.watch("source/*.html", gulp.series("copy", reload));
};


exports.default = gulp.series(
  build, server, watcher
);
