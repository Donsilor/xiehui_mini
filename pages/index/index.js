// pages/square/index.js
const app = getApp();
const api = require('../../config/api.js');
const util = require('../../utils/util.js');
const QQMapWX = require('../../utils/qqmap-wx-jssdk.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ResourceRootUrl: api.ResourceRootUrl,
    mapList:{},
    serviceList:{},
    city:'',
    recommend:1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    that.getMapList();
    that.getServiceList();
    util.getUserLocationStatus();
    that.getFindXy();
    setTimeout(function () {
      wx.stopPullDownRefresh();
    }, 1000);
  },

  getMapList: function () {
    let that = this;
    util.post(api.MapListUrl, {})
      .then(response => {
        let _data = response.data.data;
        console.log(_data)
        that.setData({
          mapList: _data
        })
      });
  },

  getFindXy: function () {
    let that = this;
    wx.getLocation({
      success(res) {
        that.getLocal(res.latitude, res.longitude);
      }
    })
  },

  getServiceList: function () {
    let that = this;
    let _recommend = that.data.recommend;
    util.post(api.ServiceListUrl, { recommend: _recommend })
      .then(response => {
        let _data = response.data.data;
        console.log(_data)
        that.setData({
          serviceList: _data
        })
      });
  },

  goOtherPage: function (e) {
    let that = this;
    let type = e.currentTarget.dataset.type;
    let _url = e.currentTarget.dataset.url;
    if (type == 1 || type == 2) {
      app.globalData.square_tab = type;
      wx.switchTab({
        url: _url
      }) 
    } else {
      wx.navigateTo({
        url: _url
      })
    }
  },

  goServiceDetail: function (e) {
    let that = this;
    let _id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../merchant/service/index?id=' + _id
    })
  },

  goSearch: function () {
    wx.navigateTo({
      url: '../search/index'
    })
  },


  // 获取当前地理位置
  getLocal: function (latitude, longitude) {
    let that = this;
    let qqmapsdk = new QQMapWX({
      key: api.QqmapsdkKey
    });
    qqmapsdk.reverseGeocoder({
      location: {
        latitude: latitude,
        longitude: longitude
      },
      success: function (res) {
        let province = res.result.ad_info.province
        let city = res.result.ad_info.city
        // console.log(res.result.ad_info);
        that.setData({
          province: province,
          city: city,
          latitude: latitude,
          longitude: longitude
        })

      },
      fail: function (res) {
        console.log(res);
      },
      complete: function (res) {
        // console.log(res);
      }
    });
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
    var that = this;
    that.onLoad();
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
  }
})