// pages/search/index.js
const api = require('../../config/api.js');
const util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ResourceRootUrl: api.ResourceRootUrl,
    avatarRootUrl: api.ResourceRootUrl + '/storage/avatars/',
    serviceList: {},
    demandList: {},
    shopList: {},
    service_show: false,
    demand_show: false,
    shop_show: false,
    keyword:''
  },

  changeKey: function (e) {
    let that = this;
    let _value = e.detail.value;
    that.setData({
      keyword: _value
    })
  },

  search:function () {
    let that = this;
    let _keyword = that.data.keyword;
    if (!_keyword) {
      wx.showToast({
        title: '请输入搜索内容',
        icon: 'none',
        duration: 1000
      });
      return false;
    }
    that.setData({
      serviceList: {},
      demandList: {},
      shopList: {},
      service_show: false,
      demand_show: false,
      shop_show: false
    })
    that.getServiceList();
    that.getDemandList();
    that.getShopList();
  },

  //点击切换
  clickTab: function (e) {
    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current,
      })
    }
  },

  goDetail: function (e) {
    let that = this;
    let _url = e.currentTarget.dataset.url;
    wx.navigateTo({
      url: _url
    })
  },

  getServiceList: function () {
    let that = this;
    let _keyword = that.data.keyword;
    util.post(api.ServiceListUrl, { searchKey: _keyword })
      .then(response => {
        let _data = response.data.data;
        console.log(_data)
        if (!_data || _data.length == 0) {
          return false;
        }
        that.setData({
          currentTab: 1,
          service_show: true,
          serviceList: _data
        })
      });
  },

  getDemandList: function () {
    let that = this;
    let _keyword = that.data.keyword;
    util.post(api.DemandListUrl, { searchKey: _keyword })
      .then(response => {
        let _data = response.data.data;
        console.log(_data)
        if (!_data || _data.length == 0) {
          return false;
        }
        that.setData({
          currentTab: 2,
          demand_show: true,
          demandList: _data
        })

      });
  },

  getShopList: function () {
    let that = this;
    let _keyword = that.data.keyword;
    util.post(api.ShopListUrl, { searchKey: _keyword })
      .then(response => {
        let _data = response.data.data;
        console.log(_data)
        if (!_data || _data.length == 0) { 
          return false;
        }
        that.setData({
          currentTab: 3,
          shop_show: true,
          shopList: _data
        })
      });
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