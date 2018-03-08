/**
 * 文件说明: httpClient
 * 详细描述: 接口请求客户端
 * 创建者: 姜赟
 * 创建时间: 15/10/26
 * 变更记录:
 */
import request from 'superagent';
import Q from 'q';
import pathInterceptor from './pathInterceptor';
import tokenInterceptor from './tokenInterceptor';


/**
 * 拦截器
 * @type {{request: Array, requestError: Array, response: Array, responseError: Array}}
 */
// let interceptors = [pathInterceptor];
let interceptors = [pathInterceptor, tokenInterceptor];

const serverRequest = (config = {}) => {
  config.headers = config.headers ? config.headers : {};
  //设置content-type
  if (!config.upload) {
    if(config.headers.type !== 'form'){
      Object.assign(config.headers, {
        'Content-Type': 'application/json'
      });
    }
    if(config.headers.unionid){
      Object.assign(config.headers, {
        'unionid': config.headers.unionid,
        'accesstoken':config.headers.accesstoken
      });
    }
  }
  //如果为服务端请求,构造请求完整路径,防止请求默认的80端口
  const env = process.env.NODE_ENV || 'development';
  let BASE_URL;
  if (env == 'development') {
    // 开发环境,使用正向代理
    BASE_URL = !process.browser ? ('http://127.0.0.1:' + (process.env.PORT || 3030)) : '';
  }else {
    // 非开发环境,使用
    BASE_URL = process.env.API_HOST || '';
    //console.log(BASE_URL,'BASE_URL')
  }
  let defer = Q.defer();
  let req = request(config.method, BASE_URL + config.url);
    //console.log('req状态',req)
  //req.timeout(1000)
   if (config.headers.timeout) {
   req.timeout(config.headers.timeout);
   }else {
   req.timeout(3*60000);
   }
  //
  if (config.upload) {
    const fields = config.data.fields;
    fields.map((field) => {
      req.field(field.name, field.value);
    });
    req.attach(config.data.name, config.data.file, config.data.file.name);

  } else {
    if (/post/i.test(config.method)) {
      req.send(config.data)
    } else {
      req.query(config.params)
    }
  }
  if (config.headers.type === 'form') {
    req.type('form');
    delete config.headers.type;
    delete config.headers['content-type'];
    delete config.headers['Content-Type'];
  }
  //不要设置 options 过滤设置
  if (!config.filter) {
    req.set(config.headers || {});
  }
  req.end((error, response) => {
    if (error) {
      if(!response){
        defer.reject({code: 500, data: {msg:'接口请求超时'}});
      }else{
        defer.reject({code: response.statusCode, data: response.body});
      }
    }else{
      defer.resolve(response && response.body);
    }
  });
  return defer.promise;
};

function http(option = {}) {
  let chain = [serverRequest, undefined];
  let promise = Q.when(option);
  for (let i = 0, len = interceptors.length; i < len; i++) {
    let interceptor = interceptors[i];
    if (interceptor.request || interceptor.requestError) {
      chain.unshift(interceptor.request, interceptor.requestError);
    }
    if (interceptor.response || interceptor.responseError) {
      chain.push(interceptor.response, interceptor.responseError);
    }
  }

  while (chain.length) {
    let thenFn = chain.shift();
    let rejectFn = chain.shift();

    promise = promise.then(thenFn, rejectFn);
  }
  return promise;
}

function get(url, params={}, headers={}) {
  const config = {
    method: 'GET',
    params,
    url,
    headers
  };
  return http(config);
}

function post(url, data={}, headers={}) {
  const config = {
    method: 'POST',
    url,
    data,
    headers
  };
  return http(config);
}

function upload(url, data={}, headers={}) {
  const config = {
    method: 'POST',
    url,
    data,
    headers,
    upload: true
  };
  return http(config);
}


function filterPost(url, data = {}, headers = {}) {
  const config = {
    method: 'POST',
    url,
    data,
    headers,
    filter: true
  };
  return http(config);
}

function head(url) {
  let defer = Q.defer();
  request
      .head(url+'?date='+new Date().getTime())
      .end((error) => {
        if (error) {
          defer.reject();
        }
        defer.resolve();
      });
  return defer.promise;
}

export default {
  http,
  get,
  post,
  upload,
  head,
  filterPost,
  interceptors
};
