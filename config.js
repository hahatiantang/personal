/**
 * 文件说明: 配置文件
 * 详细描述:
 * 创建者: 姜赟
 * 创建时间: 16/1/29
 * 变更记录:
 */

module.exports = {
	// 接口代理配置
	API_PROXY_CONFIG: {
		DEBUG: true,
		path: process.env.API_PATH || '/tf',
		host: 'http://stg2.v5time.net',
		ENV: process.env.NODE_ENV || 'development',
		HOST: process.env.HOST || 'http://stg2.v5time.net',
		TARGET_PATH: process.env.TARGET_PATH || '/tf',
		API_HOST: process.env.API_HOST || 'http://stg2.v5time.net',
		API_PATH: process.env.API_PATH || '/tf',

		//host: 'http://www.timeface.cn',
		changeOrigin: true,
		websockets: false,
		// 本地存储键值
		STORAGE_KEY: {
			TOKEN: 'tf-token',
			UID: 'tf-uid'
		},
		// 测试环境帐号
		// TEST_ACCOUNT: {
		// 	TOKEN: '90d3e5e7069bd85700df17cbf59d92a8',
		// 	UID: '407988047842'
		// },
		// pathRewrite: 规则重写
		pathRewrite: {
			//'/oldApi': '/newApi'
		}
	},
	// 接口服务器配置
	API_SERVER: {
		host: 'http://stg2.v5time.net',
		path: process.env.API_PATH || '/tf'
	},
	// 需要裁剪uid的路径
	NEED_CUT_UID_PATH: [
		'/calendar/dgq',
		'/calendar/edit',
		'/calendar/noteedit',
		'/calendar/photoBookType',
		'/calendar/preview',
		'/calendar/notepreview',
		'/pod'
	],

	ALiConfig:{
		aLiSTS: 'http://auth.timeface.cn/web/sts' ,
		aLiUploadUrl: 'img1.timeface.cn',
		aLiUploadDir: 'times'
	},
	AUTH_RELATED:{
		appid: process.env.NODE_ENV == 'production'? 'wxbeba82ef43c9b6a9': process.env.appid || 'wxc9643b4d9d4f9c03',
		appSecret: process.env.appSecret || '9a8e08eb8d12d87e146c202479c891ac',
		host:process.env.NODE_ENV=='production'?'www.timeface.cn': process.env.REDIRECT_URL_HOST,
		newHost:process.env.NODE_ENV=='production'?'www.timeface.cn': 'stg2.v5time.net',
		pathname:process.env.NODE_ENV=='production'?'/wxopen/auth/index':'/wxopen/auth/index'
	},

	//开放平台服务端请求
	API_OPEN:{
		host:'http://open.v5time.net', //http://open.timeface.cn
		path:'/openpod'
	},

	//公众号照片书服务端请求
	PHOTO_API:{
		host:'http://wechat.v5time.net', //'http://wechat.timeface.net'
		path:'/wxopen'
	},

	TDK:{
		title:'时光流影',
		description:'时光流影',
		keywords:'时光流影'
	},
	WebViewJS: "<script>(function() {if (typeof WeixinJSBridge == 'object' && typeof WeixinJSBridge.invoke == 'function') {handleFontSize();} else {if (document.addEventListener) {document.addEventListener('WeixinJSBridgeReady', handleFontSize, false);} else if (document.attachEvent) { document.attachEvent('WeixinJSBridgeReady', handleFontSize);document.attachEvent('onWeixinJSBridgeReady', handleFontSize);}}function handleFontSize() {WeixinJSBridge.invoke('setFontSizeCallback', { 'fontSize' : 0 });WeixinJSBridge.on('menu:setfont', function() {WeixinJSBridge.invoke('setFontSizeCallback', { 'fontSize' : 0 });});}})();</script>",
	LIBJS: "<script type='text/javascript' src='//g.alicdn.com/sj/lib/zepto/zepto.min.js' charset='utf-8'></script>",
	WECHAT_JS: "<script src='http://res.wx.qq.com/open/js/jweixin-1.0.0.js'></script>",
	SUI_MOBILE_JS: "<script type='text/javascript' src='//g.alicdn.com/msui/sm/0.6.2/js/??sm.min.js,sm-city-picker.min.js' charset='utf-8'></script>",
	// 百度统计代码<script src='http://stg2.v5time.net/actives/vconsole.min.js'></script>
	BAIDU_CODE: '<script>var _hmt = _hmt || [];(function() {var hm = document.createElement("script");hm.src = "//hm.baidu.com/hm.js?cfa10242ad04277ae2a1ff2c15508841";var s = document.getElementsByTagName("script")[0]; s.parentNode.insertBefore(hm, s);})();</script><script>(function(){var b=document.createElement("script");b.src="//push.zhanzhang.baidu.com/push.js";var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(b,a)})();</script>'
};
