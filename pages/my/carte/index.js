// pages/my/carte/index.js
const app = getApp();
const api = require('../../../config/api.js');
const util = require('../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ResourceRootUrl: api.ResourceRootUrl,
    detail:{},
    type:2,
    limit:3,
    attentionList:{},
    is_hidden:true,
    att_hidden: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    that.getCarteDetail();
    setTimeout(function() {
      that.setData({
        is_hidden: false
      })
    },500);

  },

  getCarteDetail: function () {
    let that = this;
    util.post(api.CarteUrl)
      .then(response => {
        let _data = response.data.data;
        console.log(_data)
        if (_data) {
          that.setData({
            detail: _data
          })
        }
      });
  },

  getAttentionList: function () {
    let that = this;
    let _type = that.data.type;
    let _limit = that.data.limit;
    util.post(api.AttentionListUrl, { type: _type, limit: _limit})
      .then(response => {
        let _data = response.data.data;
        console.log(_data)
        let _attentionList = {};
        if (_data) {
          _attentionList = _data;
        }
        that.setData({
          attentionList: _attentionList,
          att_hidden: false
        })
      });
  },

  goPage: function (e) {
    let that = this;
    let _url = e.currentTarget.dataset.url;
    wx.navigateTo({
      url: _url
    })
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
    that.getAttentionList();
    if (app.globalData.mobile) {
      that.setData({
        'phone': app.globalData.mobile
      })
    }
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
        url: 'create/index'
      })
      return false;
    }
    util.post(api.GetPhoneUrl, params).then(respond => {
      let _data = respond.data;
      app.globalData.mobile = _data.phoneNumber;
      wx.navigateTo({
        url: 'create/index'
      })
    });
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
    let that = this;
    let _title = that.data.detail.name;
    let logo = that.data.detail.logo;
    let _imgUrl = that.data.ResourceRootUrl + logo;
    util.userShare();
    return {
      title: _title,
      imageUrl: _imgUrl
    }
  }

})