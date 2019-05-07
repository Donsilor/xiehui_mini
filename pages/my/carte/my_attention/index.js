// pages/my/carte/my_attention/index.js
const api = require('../../../../config/api.js');
const util = require('../../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ResourceRootUrl: api.ResourceRootUrl,
    attentionList:{},
    type: 2,
    count:0,
    is_hidden:true,
    no_hidden:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
  },

  getAttentionList: function () {
    let that = this;
    let _type = that.data.type;
    util.post(api.AttentionListUrl, { type: _type })
      .then(response => {
        let _data = response.data.data;
        console.log(_data)
        if (!_data || _data.length == 0) {
          that.setData({
            is_hidden: true,
            no_hidden: false
          })
          return false;
        }
        let _count = _data.length;
        that.setData({
          attentionList: _data,
          count: _count,
          is_hidden:false
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