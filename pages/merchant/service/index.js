// pages/merchant/service/index.js
const api = require('../../../config/api.js');
const util = require('../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ResourceRootUrl: api.ResourceRootUrl,
    detail:{},
    main_images:{},
    content_images:{},
    collectionStatus: false,
    collectionType: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    let _id = options.id;
    that.getDetail(_id);
    that.getCollectionStatus(_id);
  },

  getDetail: function (id) {
    let that = this;
    let _id = id;
    util.post(api.ServiceViewUrl, { id: _id })
      .then(response => {
        let _data = response.data.data;
        console.log(_data)
        that.setData({
          detail: _data,
          main_images: _data.main_images,
          content_images: _data.content_images
        })
      });
  },

  /**
   * 查看登录用户是否已收藏
   */

  getCollectionStatus: function (_id) {
    let that = this;
    let postParams = {};
    postParams.type = that.data.collectionType;
    postParams.operation_id = _id;
    util.post(api.GetCollectionStatusUrl, postParams)
      .then(response => {
        let _data = response.data.data;
        console.log(_data)
        if (_data && _data.status == 1) {
          that.setData({
            collectionStatus: true
          })
        }
      });
  },

  makePhone: function (e) {
    let that = this;
    let phone = e.currentTarget.dataset.phone;
    wx.makePhoneCall({
      phoneNumber: phone
    })
  },

  goshop: function (e) {
    let that = this;
    let _shop_id = that.data.detail.shop_id;
    wx.navigateTo({
      url: '../home/index?id=' + _shop_id,
    })
  },

  /**
	   * 用户收藏
	   */
  clickCollection: function () {
    let that = this
    let postParams = {};
    postParams.operation_id = that.data.detail.id;
    postParams.type = that.data.collectionType;
    util.post(api.CollectionUrl, postParams)
      .then(response => {
        let status = that.data.collectionStatus;
        let _collectionStatus = true
        if (status) {
          _collectionStatus = false;
        }
        that.setData({
          collectionStatus: _collectionStatus
        })
        wx.showToast({
          title: '操作成功',
          icon: 'success',
          duration: 1000
        })
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