/**
 * 文件说明: 路径拦截器
 * 详细描述: 添加接口请求baseUrl
 * 创建者: 姜赟
 * 创建时间: 15/10/30
 * 变更记录:
 */
import Config from '../../../../config';

export default {
  request: (config) => {
//正则表达式含义： 排除后缀为.html | 排除前缀为http: https:
    if (!/.+(?=\.html$)/.test(config.url) && !/^(?=(http\:|https\:)).*/.test(config.url)) {
      //console.log('path路径',Config.API_PROXY_CONFIG.TARGET_PATH)
      //console.log('path路径',process.env.TARGET_PATH)
      config.url = Config.API_PROXY_CONFIG.TARGET_PATH + config.url;
    }
    return config;
  }
};