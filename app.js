var  express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const compression = require('compression');
const proxyMiddleware = require('http-proxy-middleware');
const fs = require('fs');
const jsdom = require('jsdom');
const mockMiddleware = require('./middleware/mockMiddleware');
const webpackMiddware = require('./middleware/webpackMiddleware');
const routes = require('./routes/index');
const config = require('./config');

const app = express();
app.use(cookieParser());
// 初始化 state
app.locals.initialState = {};
app.locals.ENVIRONMENT = app.get('env')=='production' ? JSON.stringify("production" ): JSON.stringify("development");
app.locals.WebViewJS = config.WebViewJS;
app.locals.LIBJS = config.LIBJS;
app.locals.WECHAT_JS = config.WECHAT_JS;
app.locals.SUI_MOBILE_JS = config.SUI_MOBILE_JS;
app.locals.BAIDU_CODE = config.BAIDU_CODE;
app.locals.sparkMd5 = '//cdn.bootcss.com/spark-md5/2.0.2/spark-md5.min.js';
app.locals.vconsole = 'http://stg2.v5time.net/actives/jssdk/vconsole.min.js';

app.locals.title = config.TDK.title;
app.locals.description = config.TDK.description;
app.locals.keywords = config.TDK.keywords;
// 设置调试模式
app.set('debug', app.get('env') === 'development');

// 模板引擎设置
if (app.get('debug')) {
	app.set('views', path.join(__dirname, 'assets/src'));
} else {
	app.set('views', path.join(__dirname, 'assets/dist'));
}
app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile);

if (app.get('debug')) {
	//if (process.env.NODE_ENV_MOCK) {
	//	// 开启mock数据
	//	app.use(mockMiddleware);
	//	console.log('开启Mock');
	//}

	// 调试环境开启接口代理
	var proxyConfig = config.API_PROXY_CONFIG;
	// 配置接口代理路径
	var context = proxyConfig.TARGET_PATH;
	// 配置代理选项
	var options = {
		target: proxyConfig.HOST,
		changeOrigin: proxyConfig.changeOrigin,
		pathRewrite: proxyConfig.pathRewrite
	};
	// 创建代理中间件
	var proxy = proxyMiddleware(context, options);
	app.use(proxy);


	app.use(proxyMiddleware('/hd',{
		target:app.get('env')!='production'?'http://stg2.v5time.net':'http://www.timeface.cn',
		changeOrigin: true
	}))

	// 开启webpack
	webpackMiddware(app, app.get('debug'));
}

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(require('less-middleware')(path.join(__dirname, 'public')));
if (!app.get('debug')) {
	app.use('/calendar',express.static(path.join(__dirname, 'assets/dist')));
}
app.use('/calendar',express.static(path.resolve(__dirname, 'public')));
app.use(compression());

// 修改render方法
app._render = app.render;
app.render = function (name, options, callback) {
	if (app.get('debug')) {
		// 匹配同名目录下的同名文件
		const jsDOMFormatter = jsdom.jsdom;
		const serializeDocument = jsdom.serializeDocument;
		const window = jsDOMFormatter().defaultView;
		const filename = path.join(app.get('views'), name, name + '.' + app.get('view engine'));
		console.log('filename', filename);
		const injectStyle = (err, html) => {
			// 注入style
			htmlDOM = jsDOMFormatter(html);
			var styleTag = window.document.createElement('link');
			styleTag.setAttribute('rel', 'stylesheet');
			if(`${name}` == 'payPage'){
				styleTag.href = '../'+`${name}.entry.css`;
				console.log('styleTag.href ',styleTag.href )
			}else{
				styleTag.href = '/calendar'+`${name}.entry.css`;
			}
			htmlDOM.head.appendChild(styleTag);
			callback.call(this, err, serializeDocument(htmlDOM));
		};
		if (fs.existsSync(filename)) {
			// 同名文件存在,渲染该文件
			app._render(filename, options, injectStyle);
		}else {
			// 同名文件不存在,按原有逻辑渲染
			app._render(name, options, callback);
		}
	}else {
		app._render(name, options, callback);
	}
};

app.use('/', routes);

// 404错误处理
app.use((req, res, next) => {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// 异常处理

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
	app.use((err, req, res, next) => {
		res.status(err.status || 500);
		res.send(err.toString());
		//res.render('error', {
		//	message: err.message,
		//	error: err
		//});
	});
}

// production error handler
// no stacktraces leaked to user
app.use((err, req, res, next) => {
	res.status(err.status || 500);
	res.send(err.toString());
});


module.exports = app;
