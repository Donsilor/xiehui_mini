const api = require('../../../config/api.js');
const util = require('../../../utils/util.js');
//index.js
//获取应用实例
const app = getApp();

Page({
    data: {
        imgUrls: [
            'https://images.unsplash.com/photo-1551334787-21e6bd3ab135?w=640',
            'https://images.unsplash.com/photo-1551214012-84f95e060dee?w=640',
            'https://images.unsplash.com/photo-1551446591-142875a901a1?w=640'
        ],
        indicatorDots: true,
        autoplay: false,
        interval: 5000,
        duration: 1000,

        userApplyInfo: {}
    },


    changeIndicatorDots(e) {
        this.setData({
            indicatorDots: !this.data.indicatorDots
        })
    },
    changeAutoplay(e) {
        this.setData({
            autoplay: !this.data.autoplay
        })
    },
    intervalChange(e) {
        this.setData({
            interval: e.detail.value
        })
    },
    durationChange(e) {
        this.setData({
            duration: e.detail.value
        })
    },

    onLoad: function (options) {

    },

    onShow: function (options) {
        let that = this;
        // 检查用户是否已经提交注册申请
        util.post(api.UserAuthInfo, {}).then(res => {
            let responseData = res.data.data;
            this.setData({
                userApplyInfo: responseData
            });

            if (responseData != '') {
                // 如果申请已经审核通过，则提示不能再注册了，并且跳到个人中心首页
                if (responseData.status == 3) {
                    wx.showToast({
                        title: '你的申请已经审核通过，不能重复注册！',
                        icon: 'none',
                        duration: 3000,
                        success: function (err) {
                            wx.switchTab({
                                url: '../../my/index/index',
                            });
                        }
                    });
                }
            }
        }).catch((err) => {

        });
    },


    navigateTo(event) {
        let that = this;
        let _type = event.currentTarget.dataset.type;

        let responseData = that.data.userApplyInfo;
        let applyStatus = responseData.status;
        if(applyStatus == undefined){
            if ((_type == 1) || (_type == 2)) {
                wx.navigateTo({
                    url: '../personal/index?type=' + _type　　// 页面 A
                })
            } else {
                wx.navigateTo({
                    url: '../company/index?type=' + _type　　// 页面 A
                })
            }
            return false;
        }

        let showModalContent = '您的申请正在审核中，是否需要修改申请？';
        switch (applyStatus) {
            case 1:
                showModalContent = '您的申请正在审核中，是否需要修改申请？';
                break;
            case 2:
                showModalContent = '您的申请未通过审核（原因：' + responseData.remarks + '），是否需要修改申请？';
                break;
        }

        if ((applyStatus == 1) || (applyStatus == 2)) {
            wx.showModal({
                title: '温馨提示',
                content: showModalContent,
                success(res) {
                    if (res.confirm) {
                        if ((_type == 1) || (_type == 2)) {
                            wx.navigateTo({
                                url: '../personal/index?type=' + _type　　// 页面 A
                            })
                        } else {
                            wx.navigateTo({
                                url: '../company/index?type=' + _type　　// 页面 A
                            })
                        }
                    }
                }
            })
        }else{
            wx.showToast({
                title: '你的申请已经审核通过，不能重复注册！',
                icon: 'none',
                duration: 3000,
                success: function (err) {
                    wx.switchTab({
                        url: '../../my/index/index',
                    });
                }
            });
        }

    }
});
