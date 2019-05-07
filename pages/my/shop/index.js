// pages/my/shop/index.js
const api = require('../../../config/api.js');
const util = require('../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ResourceRootUrl: api.ResourceRootUrl,
    detail:{},
    is_hidden: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    that.getList();
  },

  getList: function () {
    let that = this;
    util.post(api.ShopUrl, {})
      .then(response => {
        let _data = response.data.data;
        console.log(_data)
        if (!_data) {
          wx.navigateTo({
            url: 'prompt/index',
          })
          return false;
        }
        that.setData({
          detail: _data,
          is_hidden:false
        })
      });
  },

  goPage: function (e) {
    let that = this;
    let _type = e.currentTarget.dataset.type;
    let _id = that.data.detail.id;
    let _url = '../../merchant/home/index?id=' + _id;
    if (_type == 2) {
      _url = '../service/create/index';
    } else if (_type == 3) {
      _url = 'create/index?id=' + _id;
    } else if (_type == 4) {
      _url = '../service/index';
    }
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