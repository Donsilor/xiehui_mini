// pages/my/member/index.js
const api = require('../../../config/api.js');
const util = require('../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    member:{},
    memberType:2
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    that.getMember();
  },

  changeType: function(e) {
    let that = this;
    let _type = e.currentTarget.dataset.type;
    console.log(_type)
    that.setData({
      memberType: _type
    })
  },

  join: function () {
    let that = this;
    let _type = that.data.memberType;
    let _user_type = that.data.member.type;
    if (_user_type > _type) {
      wx.showToast({
        title: '请选择更高级别会员',
        icon: 'none',
        duration: 1000
      })
      return false;
    }
    wx.navigateTo({
      url: 'office/index?type=' + _type,
    })
  },

  getMember: function () {
    let that = this;
    util.post(api.GetMemberUrl)
      .then(response => {
        let _data = response.data.data;
        console.log(_data)
        that.setData({
          member: _data
        });
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