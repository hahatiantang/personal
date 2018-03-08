/**
 * 文件说明: webpack生产环境配置
 * 详细描述:
 * 创建者: 姜赟
 * 创建时间: 16/2/1
 * 变更记录:
 */
var webpack = require('webpack');
var path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var AssetsPlugin = require('assets-webpack-plugin');
var assetsPluginInstance = new AssetsPlugin({filename:'assets/assets-map.json',update: true,prettyPrint: true});

var autoprefixer = require('autoprefixer');
var precss      = require('precss');
var node_modules = path.join(__dirname,'./node_modules');

/* 不需要webpack解析的排除列表 */
var noParse = [
	'react',
	'redux',
	'react-dom',
	'react-redux',
	'redux-form',
	'redux-thunk',
	'superagent',
	'moment',
	'url-parse',
	'q',
	'lodash',
	'local-storage',
	'redux-logger',
	'cookies-js'
];
var config = {
	devtool: 'source-map',
	target: 'web',
	cache: true,
	// entry: {
	// 	common: [
	// 		'react',
	// 		'redux',
	// 		'react-dom',
	// 		'react-redux',
	// 		'redux-form',
	// 		'redux-thunk',
	// 		'superagent',
	// 		'moment',
	// 		'url-parse',
	// 		'q',
	// 		'lodash',
	// 		'local-storage',
	// 		'redux-logger',
	// 		'cookies-js'
	// 	]
	// },
	output: {
		filename: '[name]-[chunkhash].js',
		chunkFilename: '[name]-[chunkhash].js',
		path: path.join(__dirname, 'assets/dist'),
		libraryTarget: 'umd',
		publicPath: '/calendar'
	},
	module: {
		loaders: [
			{
				test: /[\.jsx|\.js]$/,
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
					cacheDirectory: true
				}
			}, {
				test: /\.css$/,
				loader: ExtractTextPlugin.extract("style-loader", "css-loader")
			}, {
				test: /\.less$/,
				loader: ExtractTextPlugin.extract("style-loader", "css-loader!less-loader")
			}, {
				test: /\.(png|jpg|gif)$/,
				loader: 'url-loader?limit=8192&name=/images/[name]-[hash].[ext]'
			}, {
				test: /\.(ttf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
				loader: 'file?name=./font/[name]-[hash].[ext]'
			}, {
				test: /\.json$/,
				loader: 'json'
			}]
	},
	plugins: [
		new webpack.DefinePlugin({
			'process.env.NODE_ENV': JSON.stringify("production"),
			TARGET_HOST: JSON.stringify("http://www.timeface.cn"),
			WECHAT_HOST: JSON.stringify("http://wechat.timeface.cn")
			//  TARGET_HOST: JSON.stringify("http://stg2.v5time.net"),
			//  WECHAT_HOST: JSON.stringify("http://wechat.v5time.net")
		}),
		new ExtractTextPlugin("[name]-[chunkhash].css"),
		new webpack.optimize.UglifyJsPlugin({
			mangle: {
				except: ['$', 'exports', 'require']
			}
		}),
		// new webpack.optimize.CommonsChunkPlugin({
		// 	name: 'vendor',
		// 	minChunks: Infinity
		// }),
		// new webpack.optimize.CommonsChunkPlugin({
		// 	name:'commons',
		// 	filename:'commons-[chunkhash].js',
		// 	minChunks:function(module,count) {
		// 		//引用测试大于某个次数
		// 		if (count >= 3) {
		// 			return true;
		// 		}
		//
		// 		//符合某种格式
		// 		var resourceName = module.resource;
		// 		if (resourceName) {
		// 			resourceName = resourceName.substring(resourceName.lastIndexOf(path.sep) + 1)
		// 		}
		// 		var reg = /^(\w)+.common/;
		// 		return reg.test(resourceName);
		// 	}
		// }),
		new webpack.DefinePlugin({
			'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
		}),
		new webpack.DllReferencePlugin({
			manifest: require('./manifest.json'),
			context: __dirname
		}),
		assetsPluginInstance
	],
	postcss: function () {
		return [autoprefixer, precss];
	}
};
/* 需要加载压缩版的js库
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
 deps.forEach(function (dep) {
 var depPath = path.resolve(node_modules, dep);
 config.resolve.alias[dep.split(path.sep)[0]] = depPath;
 var noParseFilter = new RegExp(noParse.join('|'));
 if(!noParseFilter.test(depPath)){
 console.log('Parse:', depPath);
 config.module.noParse.push(depPath);
 }
 });*/

module.exports = config;
