//获取应用实例
const app = getApp();
const api = require('../../../config/api.js');
const util = require('../../../utils/util.js');

Page({
  data: {
    demandList: {},
    main_hidden: true,
    no_hidden: true
  },

  /**
  * 生命周期函数--监听页面加载
  */
  onLoad: function (options) {
    let that = this;
    that.getMyDemandList();
  },

  getMyDemandList: function () {
    let that = this;
    util.post(api.MyDemandListUrl, {})
      .then(response => {
        let _data = response.data.data;
        console.log(_data)
        if (!_data || _data.length == 0) {
          that.setData({
            no_hidden: false
          })
          return false;
        }
        that.setData({
          demandList: _data,
          main_hidden: false
        })
      });
  },


  performDelete: function (e) {
    let that = this;
    let _id = e.currentTarget.dataset.id;
    let _key = e.currentTarget.dataset.index;
    let _statusStr = "demandList[" + _key + "].status";
    util.post(api.DemandDeleteUrl, { id: _id })
      .then(response => {
        wx.showToast({
          title: '删除成功',
          duration: 500
        })
        that.setData({
          [_statusStr]: 2
        })
      });
  },

  goCreate:function () {
    wx.navigateTo({
      url: 'create/index',
    })
  },

  goDetail: function (e) {
    let that = this;
    let _id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../../merchant/demand/index?id=' + _id
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
    let demandList = this.data.demandList
    demandList[productIndex].xmove = xmove

    this.setData({
      demandList: demandList
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
