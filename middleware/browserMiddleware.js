/**
 * 文件说明:
 * 详细描述:
 * 创建者: 姜赟
 * 创建时间: 16/2/4
 * 变更记录:
 */

module.exports = function (req, res, next) {
	// 添加非微信浏览器拦截
	var ua = req.get('user-agent').toLowerCase();
	var website = 'https://open.weixin.qq.com/connect/oauth2/authorize';
	var wxId = 'wx29be6728f40e22f9';
	if (/micromessenger/i.test(ua)) {
		next();
	} else {
		var html = '<html>' +
			'<head>' +
			'<title>抱歉，出错了</title>' +
			'<meta charset="utf-8">' +
			'<meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=0">' +
			'<link rel="stylesheet" type="text/css" href="https://res.wx.qq.com/connect/zh_CN/htmledition/style/wap_err1a9853.css">' +
			'</head>' +
			'<body>' +
			'<div class="page_msg">' +
			'<div class="inner">' +
			'<span class="msg_icon_wrp">' +
			'<i class="icon80_smile"></i>' +
			'</span>' +
			'<div class="msg_content">' +
			'<h4>请在微信客户端打开链接</h4>' +
			'</div></div></div></body></html>';
		res.end(html, 'utf-8');
	}
};