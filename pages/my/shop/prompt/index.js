// pages/my/shop/prompt/index.js
const app = getApp();
const api = require('../../../../config/api.js');
const util = require('../../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  goCreate:function () {
    wx.navigateTo({
      url: '../create/index',
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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
    if (e.detail.errMsg == 'getPhoneNumber:fail user deny') {
      wx.navigateTo({
        url: '../create/index'
      })
      return false;
    }
    util.post(api.GetPhoneUrl, params).then(respond => {
      let _data = respond.data;
      app.globalData.mobile = _data.phoneNumber;
      wx.navigateTo({
        url: '../create/index'
      })
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (app.globalData.mobile) {
      this.setData({
        'phone': app.globalData.mobile
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
  }
})