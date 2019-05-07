var api = require('../config/api.js')
var env = require('../config/env.js')

const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

/**
 * 封封微信的的request
 */
function request(url, data = {}, method = "GET") {
  return new Promise(function (resolve, reject) {
    wx.request({
      url: url,
      data: data,
      method: method,
      header: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+wx.getStorageSync('token')
      },
      success: function (res) {
        console.log("success");
        switch (res.statusCode) {
          case 422: {
            let data = res.data.errors;
            let content = '';
            Object.keys(data).map(function (key) {
              if(content == ''){
                let value = data[key];
                content = value[0];
              }
            });
            wx.showToast({
              title:content,
              icon:'none',
              duration: 3000
            });
            break;
          }
          case 403: {
            wx.showToast({
              icon:'none',
              title:res.data.message || '您没有此操作权限！',
              duration: 3000
            });
            break;
          }
          case 401: {
            wx.redirectTo({
              url: '/pages/passport/login/index'
            })
            break;
          }
          case 500:
          case 501:
          case 503:
            wx.showToast({
              icon:'none',
              title:'服务器出了点小问题,请联系客服！',
              duration: 2000
            });
            break;
          case 200:
          case 201:
            resolve(res);
            break;
        }

      },
      fail: function (err) {
        reject(err);
        wx.showToast({
          icon:'none',
          title:'服务器出了点小问题,请联系客服！',
          duration: 2000
        });
      }
    })
  });
}

function get(url, data = {}) {
  return request(url, data, 'GET')
}

function post(url, data = {}) {
  return request(url, data, 'POST')
}

/**
 * 调用微信登录
 */
function login() {
  return new Promise(function (resolve, reject) {
    wx.login({
      success: function (res) {
        if (res.code) {
          resolve(res.code);
        } else {
          reject(res);
        }
      },
      fail: function (err) {
        reject(err);
      }
    });
  });
}

function getUserInfo() {
  return new Promise(function (resolve, reject) {
    wx.getUserInfo({
      withCredentials: true,
      success: function (res) {
        if (res.detail.errMsg === 'getUserInfo:ok') {
          resolve(res);
        } else {
          reject(res)
        }
      },
      fail: function (err) {
        reject(err);
      }
    })
  });
}

const postLogin = ({ code , userInfo}) => {
  return new Promise(function (resolve, reject) {
    request(api.AuthLogin, {
      code:code,
      userInfo:userInfo
    }, 'POST').then(res => {
      if (res.statusCode === 200) {
        console.log('res.statusCode === 200')
        //存储用户信息
        wx.setStorageSync('userInfo', res.data.user_info);
        wx.setStorageSync('token', res.data.token);
        resolve(res);
      } else {
        reject(res);
      }
    }).catch((err) => {
      reject(err);
    });

  });
}

const fliesUpload = () => {
  return new Promise(function (resolve, reject) {
    wx.chooseImage({
      success: function (res) {
        //缓存下
        wx.showToast({
          title: '正在上传...',
          icon: 'loading',
          success: function (res) {

          }
        });
        wx.uploadFile({
          url: api.FilesUpload,
          filePath: res.tempFilePaths[0],
          header: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: 'Bearer '+wx.getStorageSync('token')
          },
          name: 'file',
          success: function (res) {
            switch (res.statusCode) {
              case 422: {
                let data = res.response.data.errors
                let content = ''

                Object.keys(data).map(function (key) {
                  let value = data[key]
                  content = value[0]
                })

                wx.showToast({
                  title:content,
                  duration: 1000
                });
                break
              }
              case 403: {
                wx.showToast({
                  icon:'none',
                  title:res.response.data.message || '您没有此操作权限！',
                  duration: 1000
                });
                break
              }
              case 401: {
                wx.showToast({
                  title:'要跳转到登录界面',
                  duration: 1000
                });
                break
              }
              case 500:
              case 501:
              case 503:
                wx.showToast({
                  icon:'none',
                  title:'服务器出了点小问题,请联系客服！',
                  duration: 2000
                });
                break
            }
            resolve(res);
          }, fail: function (err) {
            reject(err);
          },
          complete: function () {
            wx.hideToast();  //隐藏Toast
          }
        });
      }
    })
  });
}


/**
 * 将本地图片文件地址数组变为上传后的在线图片url数组
 * @param array filePaths
 */
const multipartFliesUpload = (_count) => {
  return new Promise(function (resolve, reject) {

    wx.chooseImage({
      count: _count,
      success: function (fileData) {
        //缓存下
        wx.showToast({
          title: '正在上传...',
          icon: 'loading',
          success: function (res) {

          }
        });
        // 上传的后端url
        const url = api.FilesUpload;
        // 因为多张图片且数量不定，这里遍历生成一个promiseList
        let promiseList = fileData.tempFilePaths.map((item) => {
          return new Promise(resolve => {
            wx.uploadFile({
              url,
              filePath: item,
              header: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + wx.getStorageSync('token')
              },
              name: 'file',
              success: (res) => {
                switch (res.statusCode) {
                  case 422: {
                    let data = res.response.data.errors
                    let content = ''

                    Object.keys(data).map(function (key) {
                      let value = data[key]
                      content = value[0]
                    })

                    wx.showToast({
                      title: content,
                      duration: 1000
                    });
                    break
                  }
                  case 403: {
                    wx.showToast({
                      icon: 'none',
                      title: res.response.data.message || '您没有此操作权限！',
                      duration: 1000
                    });
                    break
                  }
                  case 401: {
                    wx.showToast({
                      title: '请先登录',
                      duration: 3000,
                      success: function () {
                        wx.redirectTo({
                          url: '/pages/passport/user_login/index'
                        })
                      }
                    });
                    break
                  }
                  case 500:
                  case 501:
                  case 503:
                    wx.showToast({
                      icon: 'none',
                      title: '服务器出了点小问题,请联系客服！',
                      duration: 2000
                    });
                    break
                }
                const data = JSON.parse(res.data).relative_url;
                resolve(data);
              },
              fail: function (err) {
                reject(err);
              },
              complete: function () {
                wx.hideToast();  //隐藏Toast
              }
            });
          });
        });

        const result = Promise.all(promiseList).then((res) => {
          // 返回的res是个数据，对应promiseList中请求的结果，顺序与promiseList相同
          // 在这里也就是在线图片的url数组了
          return res;
        }).catch((err) => {
          reject(err);
        });
        resolve(result);
      }
    });

  });
  // 使用Primise.all来执行promiseList
  /*const result = Promise.all(promiseList).then((res) => {
    // 返回的res是个数据，对应promiseList中请求的结果，顺序与promiseList相同
    // 在这里也就是在线图片的url数组了
    return res;
  }).catch((error) => {
    console.log(error);
  });
  return result;*/
};

// 根据id获取对象数组的键（对象数组必须包含 id 这个字段）
const getObjKeyById = (objectArray, id) => {
  console.log("===========getObjKeyById 开始============");
  console.log(objectArray);
  console.log(id);

  for(let key  in objectArray){
    if(objectArray[key]['id'] == id){
      console.log("返回的key是",key);
      console.log("=========getObjKeyById 结束==============");
      return key;
      break;
    }
  }
}

// 判断当前用户是否授权
const getUserLocationStatus = () => {
  return new Promise(function (resolve, reject) {
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.userLocation']) {
          wx.authorize({
            scope: 'scope.userLocation',
            success(res) {
              resolve(res);
            }
          })
        }
      }
    })
  })
}

// 获取当前用户的经纬度
const findXy = () => {
  return new Promise(function (resolve, reject) {
    wx.getLocation({
      type: 'wgs84',
      success(res) {
        resolve(res);
      }
    })
  })
}

function getDistance(lat1, lng1, lat2, lng2) {
  // lat1用户的纬度
  // lng1用户的经度
  // lat2商家的纬度
  // lng2商家的经度
  let radLat1 = lat1 * Math.PI / 180.0;
  let radLat2 = lat2 * Math.PI / 180.0;
  let a = radLat1 - radLat2;
  let b = lng1 * Math.PI / 180.0 - lng2 * Math.PI / 180.0;
  let s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
  s = s * 6378.137;
  s = Math.round(s * 10000) / 10000;
  if (s < 1) {
    s = (s.toFixed(2)) * 1000 + 'm' //小于1km 用m表示
  } else {
    s = s.toFixed(2) + 'KM' //保留两位小数
  }
  console.log('经纬度计算的距离:' + s)
  return s
}

function chengeCode() {
  wx.login({
    success: res => {
      wx.setStorageSync('code', res.code);
    }
  })
}

function userShare(data = {}) {
  let _url = api.UserShareUrl;
  return request(_url, data, 'post');
}

module.exports = {
  formatTime: formatTime,
  getUserInfo: getUserInfo,
  login: login,
  postLogin: postLogin,
  get: get,
  post: post,
  fliesUpload: fliesUpload,
  getObjKeyById: getObjKeyById,
  getUserLocationStatus: getUserLocationStatus,
  findXy: findXy,
  getDistance: getDistance,
  multipartFliesUpload: multipartFliesUpload,
  userShare: userShare,
  chengeCode: chengeCode
}
