// pages/my/browse/index.js
const api = require('../../../config/api.js');
const util = require('../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    browseList: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
  },

  getBrowseList: function () {
    let that = this;
    util.post(api.BrowseListUrl, {})
      .then(response => {
        let _data = response.data.data;
        let _count = 0;
        let _browseList = {};
        if (_data) {
          _count =  _data.length;
          _browseList =  _data;
        }
        that.setData({
          browseList: _browseList,
          count: _count
        })
      });
  },

  emptyAll:function () {
    let that = this;
    util.post(api.BrowseEmptyAllUrl, {type:2})
      .then(response => {
        let _data = response.data;
        console.log(_data);
        console.log(_data.status);
        console.log(_data.msg);
        if (_data.status == 1) {
          wx.showToast({
            title: _data.msg,
            icon: 'none',
            duration: 1000
          });
          that.onShow();
        }
      });
  },

  goDetail: function (e) {
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
    that.getBrowseList();
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

  }
})