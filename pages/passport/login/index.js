const util = require('../../../utils/util.js');
//index.js
//获取应用实例
const app = getApp()

Page({
    data: {
        userInfo: {},
        showLoginDialog: false
    },
    attemptLogin() {
        let code = null;
        util.login().then((response) => {
            code = response;
            let userInfo = this.data.userInfo;
            util.postLogin({code,userInfo}).then((response) => {
                // 如果当前用户没有注册，就跳转到注册的页面
                let _token = wx.getStorageSync('token');
                let _user = wx.getStorageSync('userInfo');
                wx.switchTab({
                    url: '/pages/my/index/index',   //注意switchTab只能跳转到带有tab的页面，不能跳转到不带tab的页面
                })
            })
        }).catch((err) => {
            wx.showToast({
                title:'您点击了拒绝授权，将无法使用部分功能！',
                icon:'none',
                duration: 1000
            });
        })
    },
    getUserInfo(e) {
        // 将用户信息和 code 传给后台
        if(e.detail.userInfo){
            //用户按了允许授权按钮
            let UserInfo = e.detail.userInfo;
          
            this.setData({
                userInfo: UserInfo
            });
            this.attemptLogin()
        }else{
            wx.showToast({
                title:'您点击了拒绝授权，将无法使用部分功能！',
                icon:'none',
                duration: 1000
            });
        }
    }
})
