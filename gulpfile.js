/**
 * 文件说明:
 * 详细描述:
 * 创建者: 姜赟
 * 创建时间: 16/2/1
 * 变更记录:
 */
var gulp = require('gulp');
var clean = require('gulp-clean');
var	uglify = require('gulp-uglify');
var	rename = require('gulp-rename');
var gutil = require('gulp-util');
var fs = require('fs');
var glob = require('glob');
var path = require('path');
var _ = require('lodash');
var webpack = require('webpack');
var webpackConfig = require('./webpack.production');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var libJs = '/calendar/libs.min.js',
	libCss = '';
//清除数据
gulp.task('clean', function () {
	return gulp.src(['assets/dist/*', 'assets/assets-map.json'], {read: false})
		.pipe(clean())
});

function libPathPlugin() {
	this.plugin('done', function (stats) {
		var stats = stats.toJson();
		var chunkFiles = stats.chunks[0].files;
		for (var i in chunkFiles) {
			var fileName = chunkFiles[i];
			if (fileName.endsWith('.js')) {
				libJs = fileName;
			}
			if (fileName.endsWith('.css')) {
				libCss = fileName;
			}
		}
	});
}

function modifyTemplate(filename) {
	var html = fs.readFileSync(filename, 'utf-8');
	var entryFilename = path.basename(filename).replace('html', 'entry.js');
	//删除原script脚本,新增检查脚本是否存在的逻辑
	var scriptList = html.match(/<script[^>]*>[\s\S]*?<\/[^>]*script>/gi);
	if(scriptList){
		scriptList.forEach(function(script){
			if(script.indexOf(entryFilename) > -1){
				html = html.replace(script, '');
			}
		});
	}
	if (libCss) {
		// inject lib.css
		var stylesheet = '<link rel="stylesheet" href="/' + libCss + '">';
		html = html.replace('</head>', stylesheet + '</head>');
	}
	if (libJs) {
		// inject lib.js
		var javascript = '<script type="text/javascript" src="' + libJs + '"></script>';
		html = html.replace('</body>', javascript + '</body>');
	}

	return html;
}

gulp.task('lib', ['clean'], function (callback) {
	var config = _.merge({}, webpackConfig);
	config.entry = {
		//'lib': ['./assets/src/lib/lib.js']
	};
	config.externals = {};
	config.plugins = config.plugins || [];
	var plugins = config.plugins;
	//lib直接引用打包好的文件,不用Uglify.这对打包lib的速度,有重要影响
	for (var i in plugins) {
		if (plugins[i] instanceof webpack.optimize.UglifyJsPlugin) {
			plugins.splice(i, 1);
			break;
		}
	}
	//lib,不需要commons的处理
	for (var i in plugins) {
		if (plugins[i] instanceof webpack.optimize.CommonsChunkPlugin) {
			plugins.splice(i, 1);
			break;
		}
	}

	plugins.push(libPathPlugin);
	webpack(config, function (err, stats) {
		if (err) {
			throw new gutil.PluginError('webpack-lib', err);
		}
		if (typeof callback == 'function') {
			callback();
		}
	});
});
//压缩，合并 js
gulp.task('minifyjs', function() {
		return gulp.src('libs.js')      //需要操作的文件
				.pipe(rename({suffix: '.min'}))   //rename压缩后的文件名
				.pipe(uglify())    //压缩
				.pipe(gulp.dest('assets/dist'));  //输出
});
gulp.task('default', ['clean'], function () {
	var entries = {};

	var entryFiles = glob.sync('assets/src/**/*.entry.js');

	for (var i = 0; i < entryFiles.length; i++) {
		var filePath = entryFiles[i];
		var key = filePath.substring(filePath.lastIndexOf(path.sep) + 1, filePath.lastIndexOf('.'));
		entries[key] = path.join(__dirname, filePath);
	}

	var config = _.merge({}, webpackConfig);
	config.entry = entries;
	console.log('entries',entries);

	config.plugins = config.plugins || [];

	for (var i in entries) {
		//TODO 读取html,进行修改(1.移除原有的entry.js;2.注入lib)
		var relativePath = path.relative(__dirname, entries[i]);
		var htmlFilename = (relativePath + '.html').replace('.entry.js', '');
		config.plugins.push(new HtmlWebpackPlugin({
			filename: (i + '.html').replace('entry.', ''),
			templateContent: modifyTemplate(htmlFilename),
			inject: true,
			chunks: [i]
		}));
	}

	webpack(config, function (err, stats) {
		if (err) {
			throw new gutil.PluginError('webpack-build', err);
		}
	});
});
