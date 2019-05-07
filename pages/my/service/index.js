//获取应用实例
const app = getApp();
const api = require('../../../config/api.js');
const util = require('../../../utils/util.js');
Page({
  data: {
    ResourceRootUrl: api.ResourceRootUrl,
    serviceList: {},
    main_hidden: true,
    no_hidden: true
  },

  /**
    * 生命周期函数--监听页面加载
    */
  onLoad: function (options) {
    let that = this;
    that.getMyShopList();
  },

  getMyShopList: function () {
    let that = this;
    util.post(api.MyServiceListUrl, {})
      .then(response => {
        let _data = response.data.data;
        console.log(_data);
        if (!_data || _data.length == 0) {
          that.setData({
            no_hidden: false
          })
          return false;
        }
        that.setData({
          serviceList: _data,
          main_hidden: false
        })
      });
  },

  changeStatus: function (e) {
    let that = this;
    let _id = e.currentTarget.dataset.id;
    let _key = e.currentTarget.dataset.index;
    let _status = e.currentTarget.dataset.status;
    let _statusStr = "serviceList[" + _key + "].status";
    let _success_title = '上架成功';
    if (_status == 1) {
      _success_title = '下架成功';
    }
    util.post(api.ServiceChangeStatusUrl, { id: _id })
      .then(response => {
        wx.showToast({
          title: _success_title,
          duration: 500
        })
        that.setData({
          [_statusStr]: _status
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
    let _key = e.currentTarget.dataset.index;
    let _serviceList = that.data.serviceList;
    util.post(api.ServiceDeleteUrl, { id: _id })
      .then(response => {
        _serviceList.splice(_key, 1);
        that.setData({
          serviceList: _serviceList
        })
        wx.showToast({
          title: '删除成功',
          duration: 500
        })
      });
  },

  goCreate: function (e) {
    let that = this;
    let _url = e.currentTarget.dataset.url;
    wx.navigateTo({
      url: _url
    })
  },

  /**
 * 生命周期函数--监听页面显示
 */
  onShow: function () {
    let that = this;
    if (app.globalData.mobile) {
      that.setData({
        'phone': app.globalData.mobile
      })
    }
  },

  getPhoneNumber: function (e) {
    let that = this;
    if (e.detail.errMsg == 'getPhoneNumber:fail user deny') {
      wx.navigateTo({
        url: 'create/index'
      })
      return false;
    }
    util.chengeCode()
    let _iv = e.detail.iv;
    let _encryptedData = e.detail.encryptedData;
    let _code = wx.getStorageSync('code');
    let params = {
      iv: _iv,
      encryptedData: _encryptedData,
      code: _code
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
    let serviceList = this.data.serviceList
    serviceList[productIndex].xmove = xmove

    this.setData({
      serviceList: serviceList
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
  }
})
