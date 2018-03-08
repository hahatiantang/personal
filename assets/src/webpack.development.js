/**
 * 文件说明: webpack开发环境配置
 * 详细描述:
 * 创建者:
 * 创建时间: 15/10/8
 * 变更记录:
 */
'use strict';

var webpack = require('webpack');
var path = require('path');
var node_modules = path.resolve(__dirname, '../../node_modules');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
/* 需要加载压缩版的js库 */
var deps = [
	// 'react/dist/react.min.js',
	// 'react-dom/dist/react-dom.min.js',
	// 'redux/dist/redux.min.js',
	// 'react-redux/dist/react-redux.min.js',
	// 'moment/min/moment-with-locales.min.js',
	// 'redux-form/dist/redux-form.min.js',
	// 'cookies-js/dist/cookies.min.js',
	// 'weui/dist/style/weui.min.css'
];
/* 不需要webpack解析的排除列表 */
var noParse = [
	// 'react-dom',
	// 'react-redux',
	'redux-form'
];

var config = {
	target: 'web',
	cache: true,
	entry: {
		lib: [
			path.join(__dirname, 'lib/lib.js')
		]
	},
	output: {
		filename: '[name].js',
		chunkFilename: '[name].js',
		path: path.join(__dirname, '../dist'),
		libraryTarget: 'umd',
		publicPath: '/calendar'
	},
	resolve: {
		alias: [],
		extensions: ['', '.js', '.jsx']
	},
	//externals:{
	//	'react': {
	//		root: 'React',
	//		commonjs2: 'react',
	//		commonjs: 'react',
	//		amd: 'react'
	//	},
	//	'jquery': {
	//		root: 'jQuery',
	//		commonjs2: 'jquery',
	//		commonjs: 'jquery',
	//		amd: 'jquery'
	//	},
	//	'react-dom':{
	//		root:'ReactDOM',
	//		commonjs2: 'react-dom',
	//		commonjs: 'react-dom',
	//		amd:'react-dom'
	//	}
	//},
	module: {
		loaders: [
			{
				test: /\.jsx?$/,
				exclude: /node_modules/,
				loader: 'babel',
				presets: [
					'react',
					'es2015'
				],
				plugins:[
					'transform-object-assign'
				],
				query: {
					presets: ['react', 'es2015']
				}
			}, {
				test: /\.css$/,
				//loader: 'style!css'
				loader: ExtractTextPlugin.extract("style-loader", "css-loader")
			}, {
				test: /\.less$/,
				//loader: 'style!css?modules&localIdentName=[name]--[local]--[hash:base64:5]!less'
				//modules&localIdentName=[name]--[local]--[hash:base64:5]
				loader: ExtractTextPlugin.extract("style-loader", "css-loader?!less-loader")
			}, {
				test: /\.(png|jpg|gif)$/,
				loader: 'url-loader?limit=8192'
			}, {
				test: /\.(ttf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
				loader: 'file'
			}, {
				test: /\.json$/,
				loader: 'json'
			}],
		/* 不通过webpack打包 */
		noParse: []
	},
	plugins: [
		new webpack.DefinePlugin({
			TARGET_HOST: JSON.stringify("http://stg2.v5time.net"),
			WECHAT_HOST: JSON.stringify("http://wechat.v5time.net")
		}),
		new ExtractTextPlugin("[name].css"),
		new webpack.HotModuleReplacementPlugin(),
		new webpack.NoErrorsPlugin()
	],
	node: {
		fs: 'empty',
		net: 'empty',
		tls: 'empty',
		dns: 'empty'
	},
	debug: true,
	devtool: 'eval-source-map'
};

deps.forEach(function (dep) {
	var depPath = path.resolve(node_modules, dep);
	config.resolve.alias[dep.split(path.sep)[0]] = depPath;
	var noParseFilter = new RegExp(noParse.join('|'));
	if(!noParseFilter.test(depPath)){
		console.log('Parse:', depPath);
		config.module.noParse.push(depPath);
	}
});

module.exports = config;
