/**
 * Created by MFLife on 2016/8/2.
 */
var webpack = require('webpack');

const vendor = [
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
	'cookies-js'
];


module.exports = {
    output: {
        path: __dirname,
        filename: '[name].js',
        library: '[name]'
    },
    entry: {
        libs: vendor
    },
    plugins: [
        new webpack.DllPlugin({
            path: 'manifest.json',
            name: '[name]',
            context: __dirname
        })
    ]
};
