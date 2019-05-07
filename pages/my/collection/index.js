// pages/my/collection/index.js
const api = require('../../../config/api.js');
const util = require('../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ResourceRootUrl: api.ResourceRootUrl,
    avatarRootUrl: api.ResourceRootUrl + '/storage/avatars/',
    serviceList:{},
    demandList:{},
    currentTab: 1,
  },
  

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
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

  makePhone: function (e) {
    let that = this;
    let phone = e.currentTarget.dataset.phone;
    wx.makePhoneCall({
      phoneNumber: phone
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
    that.getServiceList();
    setTimeout(function() {
      that.getDemandList();
    },500)
  },

  getServiceList:function () {
    let that = this;
    let _type = 1;
    util.post(api.GetCollectionListUrl, { type: _type })
      .then(response => {
        let _data = response.data.data;
        console.log(_data)
        if (_data) {
          that.setData({
            serviceList: _data
          })
        }
      });
  },

  getDemandList: function () {
    let that = this;
    let _type = 2;
    util.post(api.GetCollectionListUrl, { type: _type })
      .then(response => {
        let _data = response.data.data;
        console.log(_data)
        if (_data) {
          that.setData({
            demandList: _data
          })
        }
      });
  },

  /**
	   * 用户收藏
	   */
  clickCollection: function (e) {
    let that = this
    let _operation_id = e.currentTarget.dataset.id;
    let _type = e.currentTarget.dataset.type;
    let postParams = {};
    postParams.operation_id = _operation_id;
    postParams.type = _type;
    util.post(api.CollectionUrl, postParams)
      .then(response => {
        if (_type == 1) {
          that.getServiceList();
        } else {
          that.getDemandList();
        }
        wx.showToast({
          title: '操作成功',
          icon: 'none',
          duration: 1000
        })
      });
  },


  /**
  * 显示删除按钮
  */
  showDeleteButton: function (e) {
    let productIndex = e.currentTarget.dataset.productindex;
    let curtype = e.currentTarget.dataset.curtype;
    this.setXmove(productIndex, curtype, -65)
  },

  /**
   * 隐藏删除按钮
   */
  hideDeleteButton: function (e) {
    let productIndex = e.currentTarget.dataset.productindex
    let curtype = e.currentTarget.dataset.curtype;
    this.setXmove(productIndex, curtype, 0)
  },

  /**
   * 设置movable-view位移
   */
  setXmove: function (productIndex, curtype,  xmove) {
    let _serviceList = this.data.serviceList;
    let _demandList = this.data.demandList
    if (curtype == 1) {
      _serviceList[productIndex].xmove = xmove
      this.setData({
        serviceList: _serviceList
      })
    } else {
      _demandList[productIndex].xmove = xmove
      this.setData({
        demandList: _demandList
      })
    }
    
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