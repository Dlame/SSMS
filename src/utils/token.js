/**
 * 保存token到cookie
 * @param {从服务端获取的token} token
 * @param {保存的半小时数} exdays
 */
var setToken = function(token, exdays) {
  var exdate = new Date(); //获取时间
  exdate.setTime(exdate.getTime() + exdays * 30 * 60 * 1000); //保存的半小时
  //字符串拼接cookie
  window.document.cookie =
    'token' + '=' + token + ';path=/;expires=' + exdate.toGMTString();
};

/**
 * 从cookie获取token
 */
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

/**
 * 清除token
 */
var clearToken = function() {
  setToken('', -1); //修改2值都为空，天数为负1天就好了
};

var clearNull = function(data) {
  for (var i = 0; i < data.length; i++) {
    for (var key in data[i]) {
      if (data[i][key] == null || data[i][key] == 'null') {
        data[i][key] = '';
      }
    }
  }
  return data;
};

export { setToken, getToken, clearToken, clearNull };
