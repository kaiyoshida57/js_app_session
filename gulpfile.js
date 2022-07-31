
const gulp = require("gulp");
const browserSync = require("browser-sync");
// const pug = require("gulp-pug");
const htmlMin = require("gulp-htmlmin");
const ssi = require("connect-ssi");
const sass = require("gulp-sass");
// const autoprefixer = require("gulp-autoprefixer");
const postcss = require("gulp-postcss"); // css-mqpackerを使うために必要
const mqpacker = require('css-mqpacker'); // メディアクエリをまとめる
const glob = require("gulp-sass-glob");
const notify = require("gulp-notify");
const plumber = require("gulp-plumber");
const babel = require("gulp-babel");
const uglify = require("gulp-uglify-es").default; //ES6の圧縮用
const imagemin = require("gulp-imagemin");
const mozjpeg = require("imagemin-mozjpeg");
const pngquant = require("imagemin-pngquant");
const webp = require('gulp-webp');
const rename = require('gulp-rename'); //webp生成時のリネーム
const changed = require("gulp-changed");
const webpackStream = require("webpack-stream");
const webpack = require("webpack");
const webpackConfig = require("./webpack.config");
const eslint = require('gulp-eslint');

const paths = {
	rootDir: "dist/",
	htmlSrc: "src/**/*.html",
	// pugSrc: ["src/pug/*.pug", "src/pug/**/*.pug", "!src/pug/_*/_*.pug","!src/pug/_*.pug"],
	scssSrc: "src/scss/**/*.scss",
	jsSrc: ["src/js/**/*.js","src/js/**/*.ts",],
	imgSrc: "src/img/**/*",
	jpgPngSrc: "src/img/**/*.{jpg,jpeg,png}",
	outCss: "dist/assets/css",
	outJs: "dist/assets/js",
	outImg: "dist/assets/img",
	outHtml: "dist/",
};

// browser sync
function browserSyncFunc(done){
	browserSync.init({
			server: {
					baseDir: paths.rootDir,
					middleware: [
						ssi({
							baseDir: paths.rootDir,
							notify: false,
							ext: ".html"
						})
					]
			},
			port: 7000,
			reloadOnRestart: true
	});
	done();
}

// html
function htmlFunc() {
	return gulp.src(paths.htmlSrc)
		.pipe(plumber({
			errorHandler: notify.onError('<%= error.message %>'),
		}))
		.pipe(
			htmlMin({
				//HTMLの圧縮
				removeComments: true, //コメントを削除
				collapseWhitespace: true, //余白を詰める
				preserveLineBreaks: true, //タグ間の改行を詰める
				removeEmptyAttributes: false //空属性を削除しない
			})
		)
		.pipe(gulp.dest(paths.outHtml))
		.pipe(browserSync.stream());
}

// sass
function sassFunc() {
		return gulp.src(paths.scssSrc , {
				sourcemaps: true
		})
		.pipe(plumber({
				errorHandler: notify.onError('<%= error.message %>'),
		}))
		.pipe(glob())
		.pipe(sass({
				outputStyle: 'compressed'
		}))
		.pipe(postcss([mqpacker({
			// max-widthで降順
			sort: function (a, b) {
				return b.localeCompare(a, undefined, {numeric: true});
			}
		})]))
		.pipe(gulp.dest(paths.outCss, {
				sourcemaps: './sourcemaps'
		}))
		.pipe(browserSync.stream());
}

// js
// eslint処理
function jsLintFunc() {
	return gulp.src(['src/**/*.js','!node_modules/**'])
		.pipe(eslint({ useEslintrc: true, fix: true }))
		.pipe(eslint.format()) // ターミナルにログ出力
		// .pipe(eslint.failAfterError()) //処理を止めてエラー出力
}

function jsFunc() {
	return plumber({
		errorHandler: notify.onError('<%= error.message %>'),
	})
	.pipe(webpackStream(webpackConfig, webpack))
	.pipe(babel())
	.pipe(uglify({}))
	.pipe(gulp.dest(paths.outJs))
	.pipe(browserSync.stream());
}

// img
function imgFunc() {
	return gulp.src(paths.imgSrc)
	.pipe(changed(paths.outImg))
	.pipe(imagemin(
		[
			mozjpeg({
				quality: 85 //画像圧縮率
			}),
			pngquant()
		],
		{
			verbose: true
		}
	))
	.pipe(gulp.dest(paths.outImg))
}

// to webp
function webpFunc() {
	return gulp.src(paths.jpgPngSrc)
	//jpg->webpじゃなく、jpg->jpg.webpの形に変換させる
	.pipe(rename(function(path) {
	path.basename += path.extname;
	}))
	.pipe(webp())
	.pipe(gulp.dest(paths.outImg))
}

// watch
function watchFunc(done) {
	// gulp.watch(paths.htmlSrc, gulp.parallel(htmlFunc));
	gulp.watch(paths.htmlSrc, gulp.parallel(htmlFunc));
	gulp.watch(paths.scssSrc, gulp.parallel(sassFunc));
	gulp.watch(paths.jsSrc, gulp.parallel(jsLintFunc));
	gulp.watch(paths.jsSrc, gulp.parallel(jsFunc));
	gulp.watch(paths.imgSrc, gulp.parallel(imgFunc));
	gulp.watch(paths.jpgPngSrc, gulp.parallel(webpFunc));
	done();
}

// scripts tasks
gulp.task('default',
gulp.parallel(
	browserSyncFunc, watchFunc, htmlFunc, sassFunc, jsLintFunc, jsFunc, imgFunc, webpFunc
	)
);

