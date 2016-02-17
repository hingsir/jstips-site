var gulp = require('gulp');
var minifycss = require('gulp-minify-css');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var rev = require('gulp-rev');
var revCollector = require('gulp-rev-collector');
var htmlmin = require('gulp-html-minifier');
var del = require('del');


var config = require('./config.js');

gulp.task('clean',function(){
	return del(['dist']);
})

gulp.task('minifycss',['clean'],function(){
	return gulp.src(['source/css/*.css','source/css/highlight/styles/' + config.highlight_style + '.css'])
		.pipe(minifycss())
		.pipe(concat('all.min.css'))
		.pipe(gulp.dest('dist/css'))
})

gulp.task('tips',['clean'],function(){
	return gulp.src(['source/tips/**/*.*'])
		.pipe(gulp.dest('dist/tips'))
})

gulp.task('images',['clean'],function(){
	return gulp.src(['source/images/**/*.*'])
		.pipe(gulp.dest('dist/images'))
})

gulp.task('scripts',['clean'],function(){
	return gulp.src(['source/js/**/*.js'])
		.pipe(uglify())
		.pipe(gulp.dest('dist/js'))
})

gulp.task('generate',['clean'],function(){
	require('./index.js')
})

gulp.task('rev',function(){
	return gulp.src('dist/css/all.min.css')
		.pipe(rev())
		.pipe(gulp.dest('dist/css'))
		.pipe(rev.manifest())
		.pipe(gulp.dest('dist/css'))
})
gulp.task('revCollector',['rev'],function(){
	return gulp.src(['dist/css/**/*.json','dist/tips/**/*.html'])
		.pipe(revCollector({
			replaceReved: true
		}))
		.pipe(gulp.dest('dist/tips'))
})
gulp.task('htmlmin',['revCollector'],function(){
	return gulp.src('dist/tips/**/*.html')
		.pipe(htmlmin({collapseWhitespace: true}))
		.pipe(gulp.dest('dist/tips'))
})

gulp.task('default',['minifycss','tips','images','scripts','generate']);
gulp.task('md5',['rev','revCollector','htmlmin']);