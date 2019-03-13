var gulp = require('gulp'),
    cleancss = require('gulp-clean-css'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
	importcss = require('gulp-import-css'),
	// rev = require('gulp-rev'),
	// revCollector = require('gulp-rev-collector'),
	
	path = {
		css:"styles/*.css",
		dialogcss:"javascripts/dialog/ui-dialog.css",
		app:["javascripts/app/*.js"],
//		selectlinkage:["javascripts/selectlinkage/selectlinkage.js"],
		views:["javascripts/views/**/**/*.js"],
	}
	

///////////////合并压缩CSS
gulp.task('jumicss',function(){
	return gulp.src('styles/app.css')		//需要操作的文件
		.pipe(rename({basename:'jumi'}))	//rename压缩后的文件名
		.pipe(importcss())					//合并
		.pipe(cleancss())					//压缩
		// .pipe(rev())						//定义一个流，将所有匹配到的文件名全部生成相应的版本号
  //       .pipe(rev.manifest()) 				//把所有生成的带版本号的文件名保存到json文件中
		.pipe(gulp.dest('styles'))			//输出文件夹
});

///////////////合并压缩 dialog
gulp.task('dialogcss',function(){
	return gulp.src('javascripts/dialog/ui-dialog.css')
		.pipe(cleancss())
		.pipe(rename({suffix:'.min'}))
        // .pipe(rev())						//定义一个流，将所有匹配到的文件名全部生成相应的版本号
        // .pipe(rev.manifest()) 				//把所有生成的带版本号的文件名保存到json文件中
		.pipe(gulp.dest('javascripts/dialog'))
});

gulp.task('dialog',function(){
	return gulp.src('javascripts/dialog/dialog.js')
		.pipe(rename({suffix:'.min'}))
		.pipe(uglify())
		.pipe(gulp.dest('javascripts/dialog'))
});

///////////////多级联动
//gulp.task('selectlinkage',function(){
//	return gulp.src('javascripts/selectlinkage/selectlinkage.js')
//		.pipe(uglify())
//		.pipe(gulp.dest('javascripts/dist/selectlinkage'))
//});

///////////////压缩app.js
gulp.task('appjs',function(){
	return gulp.src('javascripts/app.resource.js')			//需要操作的文件
		.pipe(rename({basename:'app'}))
		.pipe(uglify())										//压缩
        // .pipe(rev())						//定义一个流，将所有匹配到的文件名全部生成相应的版本号
        // .pipe(rev.manifest()) 				//把所有生成的带版本号的文件名保存到json文件中
		.pipe(gulp.dest('javascripts'))						//输出文件夹
});

///////////////压缩APP文件夹下JS
gulp.task('app',function(){
	return gulp.src('javascripts/app/*.js')			//需要操作的文件
		.pipe(uglify())								//压缩
        // .pipe(rev())						//定义一个流，将所有匹配到的文件名全部生成相应的版本号
        // .pipe(rev.manifest()) 				//把所有生成的带版本号的文件名保存到json文件中
		.pipe(gulp.dest('javascripts/dist/app'))	//输出文件夹
});

///压缩整站JS
gulp.task('multiple',function(){
	return gulp.src('javascripts/views/**/**/*.js')
		.pipe(uglify())
        // .pipe(rev())						//定义一个流，将所有匹配到的文件名全部生成相应的版本号
        // .pipe(rev.manifest()) 				//把所有生成的带版本号的文件名保存到json文件中
		.pipe(gulp.dest('javascripts/dist/views'))
});

///压缩某单个JS
gulp.task('single',function(){
	return gulp.src('javascripts/views/account/**/*.js')
		.pipe(uglify())
        // .pipe(rev())						//定义一个流，将所有匹配到的文件名全部生成相应的版本号
        // .pipe(rev.manifest()) 				//把所有生成的带版本号的文件名保存到json文件中
		.pipe(gulp.dest('javascripts/dist/views/account'))
});

///////////////执行gulp任务
gulp.task('default',[],function(){
	gulp.start('dialogcss');
	gulp.start('dialog');
//	gulp.start('selectlinkage');
	gulp.start('jumicss');
	gulp.start('appjs');
	gulp.start('app');
	gulp.start('multiple');    //zpp
	gulp.start('single');    //zpp
});

///////////////执行watch任务
gulp.task('watch',function(){
	gulp.watch(path.dialogcss,['dialogcss']);
//	gulp.watch(path.selectlinkage,['selectlinkage']);
	gulp.watch(path.css,['jumicss']);
	gulp.watch(['javascripts/app.resource.js'],['appjs']);  //zpp
	gulp.watch(path.app,['app']);
	gulp.watch(path.views,['multiple']);   //zpp  
});




