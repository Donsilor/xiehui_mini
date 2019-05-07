// pages/my/integral/index.js
const api = require('../../../config/api.js');
const util = require('../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ResourceRootUrl: api.ResourceRootUrl + '/storage/avatars/',
    detail:{},
    checkInStatus:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },


  /**
   * 签到
   */
  checkIn: function () {
    let that = this;
    util.post(api.CheckInUrl, {})
      .then(response => {
        let _data = response.data.data;
        console.log(_data);
        wx.showToast({
          title: '签到成功',
          icon: 'none',
          duration: 1000
        });
        that.setData({
          checkInStatus: true,
        });
        that.onShow();
      });
  },

  goPage: function (e) {
    let that = this;
    let _url = e.currentTarget.dataset.url;
    wx.navigateTo({
      url: _url,
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
    that.getDetail();
    that.getCheckInStatus();
  },

  getDetail: function () {
    let that = this;
    util.post(api.IntegralDetail)
      .then(response => {
        let _data = response.data.data;
        console.log(_data);
        that.setData({
          detail: _data
        })
      });
  },

  getCheckInStatus() {
    let that = this;
    util.post(api.CheckInStatusUrl)
      .then(response => {
        let _data = response.data.data;
        if (_data) {
          that.setData({
            checkInStatus:true
          })
        }
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
    util.userShare();
  }
})