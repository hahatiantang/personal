/**
 * 文件说明: 重新包装render方法
 * 详细描述:
 * 创建者: 姜赟
 * 创建时间: 16/1/29
 * 变更记录:
 */

module.exports = function (req, res, next) {
	res._render = res.render;
	res.render = function (view, options, callback) {
		console.log('enter');
		res._render(view, options, callback);
	};
	next();
};
