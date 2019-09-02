import axios from 'axios';
import router from '../router';
import { Message } from 'element-ui';

//读取cookie
var getToken = function() {
  if (document.cookie.length > 0) {
    var arr = document.cookie.split('; '); //这里显示的格式需要切割一下自己可输出看下
    for (var i = 0; i < arr.length; i++) {
      var arr2 = arr[i].split('='); //再次切割
      //判断查找相对应的值
      if (arr2[0] == 'token') {
        return arr2[1];
      }
    }
  }
};

// http request 拦截器
axios.interceptors.request.use(
  config => {
    // console.log(getToken())
    if (getToken()) {
      //判断token是否存在
      config.headers.token = getToken(); //将token设置成请求头
    }
    return config;
  },
  err => {
    Message.error({
      message: '请求超时!'
    });
    return Promise.reject(err);
  }
);

axios.interceptors.response.use(
  data => {
    return Promise.resolve(data);
  },
  err => {
    if (err.response.status == 500) {
      Message.error({
        message: '服务器出现错误！'
      });
    } else if (err.response.status == 404) {
      router.push('/404');
    } else {
      Message.error({
        message: err.response.data.error
      });
    }
    // console.log(err.response)
    return Promise.reject(err);
  }
);

export default axios;
