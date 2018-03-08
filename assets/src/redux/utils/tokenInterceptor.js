/**
 * 文件说明: 路径拦截器
 * 详细描述: 添加接口请求baseUrl
 * 创建者: 姜赟
 * 创建时间: 15/10/30
 * 变更记录:
 */
import Config from '../../../../config';
let Cookies = require('cookies-js');

export default {
  request: (config) => {
    //获取token和uid, todo 该功能展示关闭调试模式下获取测试帐号
    const tfToken = Cookies.get && Cookies.get(Config.API_PROXY_CONFIG.STORAGE_KEY.TOKEN);
    const tfUid = Cookies.get && Cookies.get(Config.API_PROXY_CONFIG.STORAGE_KEY.UID);
    if (!config.headers) {
      config.headers = {};
    }
    // 如果headers中已有tf-token和tf-uid,则不再覆盖
    if (tfToken && tfUid && !config.headers['tf-token'] && !config.headers['tf-uid']) {
      Object.assign(config.headers, {
        'tf-token': tfToken,
        'tf-uid': tfUid
      });
    }
    return config;
  }
};