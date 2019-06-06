// pages/my/index/index.js
const app = getApp();
const api = require('../../../config/api.js');
const util = require('../../../utils/util.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        ResourceRootUrl:api.ResourceRootUrl+'/storage/avatars/',
        userInfo: {}
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        let that = this;
        // 检查用户是否已经注册相关角色，如果没有注册，则跳转到角色注册界面
        let _token = wx.getStorageSync('token');
        if (!_token) {
            wx.showModal({
                title: '提示',
                content: '你还没有登录，是否登录',
                success(res) {
                    if (res.confirm) {
                        wx.navigateTo({
                            url: '../../passport/login/index'
                        });
                    } else if (res.cancel) {
                        wx.switchTab({
                            url: '/pages/index/index'
                        })
                    }
                }
            });
            return false;
        }
        // 获取用户信息
        util.get(api.UserInfoUrl, {}).then(respond => {
            let requestResponse = respond.data.data;
            console.log(requestResponse);
            that.setData({
                userInfo: requestResponse,
            });
            if (requestResponse.mobile) {
              app.globalData.mobile = requestResponse.mobile;
            }
        });
    },

    getPhoneNumber: function (e) {
      let that = this;
      let _iv = e.detail.iv;
      let _encryptedData = e.detail.encryptedData;
      let _code = wx.getStorageSync('code');
      let params = {
        iv: _iv,
        encryptedData: _encryptedData,
        code: _code
      }
      util.post(api.GetPhoneUrl, params).then(respond => {
        let _data = respond.data;
        that.setData({
          'userInfo.mobile': _data.phoneNumber
        });
      });
    },


    goOtherPage: function (e) {
      let that = this;
      let _url = e.currentTarget.dataset.url;
      wx.navigateTo({
        url: _url
      })  
    },


  goPage: function (e) {
    let that = this;
    let _userType = that.data.userInfo.type;
    let _url = e.currentTarget.dataset.url;
    let _type = e.currentTarget.dataset.type;
    let _member_switch = that.data.userInfo.member_switch;
    if (!_member_switch) {
      wx.showToast({
        title: '暂未开放此功能',
        icon: 'none',
        duration: 1000
      });
      return false;
    }
    if (_userType == 1 ) {
        wx.showModal({
          title: '会员提示',
          content: '您是普通用户，没有该权限，确定开通会员获得更多体验吗？',
          success(res) {
            if (res.confirm) {
              wx.navigateTo({
                url: '../member/index'
              })
            } else if (res.cancel) {
              return false;
            }
          }
        })
      } else {
        if (_type == 2) {
          let _shop_id = that.data.userInfo.shop_id;
          if (!_shop_id) {
            _url = '../shop/prompt/index'
          }
        }
        wx.navigateTo({
          url: _url
        })
      }

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {
      util.userShare();
    },
    navigatorToUrl:function (e) {
        let _url = e.target.dataset.url;
        if(_url){
            wx.navigateTo({
                url: _url
            })
        }
    },
    buttonNavigatorToUrl:function (e) {
        let _url = e.currentTarget.dataset.url;
        if(_url){
            wx.navigateTo({
                url: _url
            })
        }
    },

    handleContact(e) {
        console.log(e.path)
        console.log(e.query)
    }
});