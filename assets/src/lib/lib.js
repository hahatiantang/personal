/**
 * 文件说明:
 * 详细描述:
 * 创建者: 姜赟
 * 创建时间: 16/1/30
 * 变更记录:
 */
var React = require('react');
var ReactDOM = require('react-dom');
var Cookies = require('cookies-js');
var JQuery = require('jquery');
require('weui');

//动态设置fontsize rem布局
var deviceWidth = document.documentElement.clientWidth;
if (deviceWidth > 750){
  deviceWidth = 750;
}

document.documentElement.style.fontSize = deviceWidth / 7.5 + 'px';

window.React = React;
window.jQuery = JQuery;
window.$ = JQuery;
//window.$ = Zepto;
window.ReactDOM = ReactDOM;
window.Cookies = Cookies;