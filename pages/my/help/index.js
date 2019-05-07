// pages/my/help/index.js
const api = require('../../../config/api.js');
const util = require('../../../utils/util.js');
const WxParse = require('../../../utils/wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    helpList: {}
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
    let that = this
    that.getHelps()
  },

  /**
   * 获取帮助列表
   */
  getHelps: function () {
    let that = this;
    util.post(api.HelpListUrl)
      .then(response => {
        let _helpList = response.data.data;
        console.log(_helpList)
        that.setData({
          helpList: _helpList
        });
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
  },

  answerView: function (e) {
    let that = this;
    let _id = e.currentTarget.dataset.id;
    let _index = e.currentTarget.dataset.index;
    let _data = that.data.helpList[_index];
    WxParse.wxParse('content', 'html', _data.content, that, 1);
    if (that.data.currentAnswerShowId == _id) {
      _id = 0;
    }
    that.setData({
      currentAnswerShowId: _id
    });
  },
})