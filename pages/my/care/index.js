// pages/my/care/index.js
const api = require('../../../config/api.js');
const util = require('../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ResourceRootUrl: api.ResourceRootUrl,
    attentionList: {},
    type: 1,
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
        if (!_data) {
          wx.navigateTo({
            url: 'prompt/index',
          })
          return false;
        }
        let _count = _data.length;
        let _attentionList = _data;
        that.setData({
          attentionList: _attentionList,
          count: _count
        })
      });
  },

  goDetail: function (e) {
    let that = this;
    let _id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../../merchant/service/index?id=' + _id
    })
  },

  performDelete: function (e) {
    let that = this;
    let _id = e.currentTarget.dataset.id;
    let _uid = e.currentTarget.dataset.uid;
    let _key = e.currentTarget.dataset.index;
    let _attentionList = that.data.attentionList;
    let _type = that.data.type;
    util.post(api.AttentionUrl, { operation_id: _id, type: _type, uid: _uid})
      .then(response => {
        that.onShow();
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
   * 显示删除按钮
   */
  showDeleteButton: function (e) {
    let productIndex = e.currentTarget.dataset.productindex
    this.setXmove(productIndex, -65)
  },

  /**
   * 隐藏删除按钮
   */
  hideDeleteButton: function (e) {
    let productIndex = e.currentTarget.dataset.productindex

    this.setXmove(productIndex, 0)
  },

  /**
   * 设置movable-view位移
   */
  setXmove: function (productIndex, xmove) {
    let attentionList = this.data.attentionList
    attentionList[productIndex].xmove = xmove

    this.setData({
      attentionList: attentionList
    })
  },

  /**
   * 处理movable-view移动事件
   */
  handleMovableChange: function (e) {
    if (e.detail.source === 'friction') {
      if (e.detail.x < -30) {
        this.showDeleteButton(e)
      } else {
        this.hideDeleteButton(e)
      }
    } else if (e.detail.source === 'out-of-bounds' && e.detail.x === 0) {
      this.hideDeleteButton(e)
    }
  },

  /**
   * 处理touchstart事件
   */
  handleTouchStart(e) {
    this.startX = e.touches[0].pageX
  },

  /**
   * 处理touchend事件
   */
  handleTouchEnd(e) {
    if (e.changedTouches[0].pageX < this.startX && e.changedTouches[0].pageX - this.startX <= -30) {
      this.showDeleteButton(e)
    } else if (e.changedTouches[0].pageX > this.startX && e.changedTouches[0].pageX - this.startX < 30) {
      this.showDeleteButton(e)
    } else {
      this.hideDeleteButton(e)
    }
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