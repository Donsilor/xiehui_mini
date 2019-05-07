// pages/my/carte/detail/index.js
const api = require('../../../../config/api.js');
const util = require('../../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ResourceRootUrl: api.ResourceRootUrl,
    detail:{},
    attentionType:2,
    attentionStatus:false,
    is_hidden:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    let _id = options.id;
    that.getDetail(_id);
  },

  getDetail: function (id) {
    let that = this;
    let _id = id;
    util.post(api.CarteDetailUrl, { id, _id})
      .then(response => {
        console.log(_data)
        let _data = response.data.data;
        let _attentionStatus = false;
        if (_data) {
          if (_data.attention_status == 1) {
            _attentionStatus = true;
          }
          that.setData({
            id: _id,
            detail: _data,
            attentionStatus: _attentionStatus,
            is_hidden:false
          })
        }
      });
  },

  goPage: function (e) {
    let that = this;
    let _url = e.currentTarget.dataset.url;
    wx.navigateTo({
      url: _url
    })
  },

  goShop: function () {
    let that = this;
    let _shop_id = that.data.detail.shop_id;
    if (!_shop_id) {
      wx.showToast({
        title: '对方没有创建店铺，无法查看',
        icon: 'none',
        duration: 1000
      });
      return false;
    }
    wx.navigateTo({
      url: '../../../merchant/home/index?id=' + _shop_id
    })
  },

  makePhone: function (e) {
    let that = this;
    let _phone = that.data.detail.phone;
    if (!_phone) {
      wx.showToast({
        title: '对方没有设置手机号！',
        icon: 'none',
        duration: 1000
      });
      return false;
    }
    wx.makePhoneCall({
      phoneNumber: _phone
    })
  },


  /**
   * 关注
   */
  changeAttention: function (e) {
    let that = this;
    let status = true;
    let _id = that.data.id;
    let _type = that.data.attentionType;
    let _shop_user_id = that.data.detail.user_id;
    util.post(api.AttentionUrl, { operation_id: _id, type: _type, uid: _shop_user_id })
      .then(response => {
        wx.showToast({
          title: '操作成功',
          icon: 'success',
          duration: 2000
        })
        let _ctype = e.currentTarget.dataset.ctype;
        let _attention_num = that.data.detail.attention_num;
        if (_ctype == 1) {
          _attention_num--;
        } else {
          _attention_num++;
        }
        if (that.data.attentionStatus) {
          status = false;
        }
        that.setData({
          'detail.attention_num': _attention_num,
          attentionStatus: status
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

  }
})