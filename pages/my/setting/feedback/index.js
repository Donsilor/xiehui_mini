// pages/my/setting/feedback/index.js
const api = require('../../../../config/api.js');
const util = require('../../../../utils/util.js');
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
    is_submit: 0
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {

	},

  /**
   * 提交
   */
  formSubmit(e) {
    let that = this;
    let _remark = e.detail.value.remark;
    if (!_remark) {
      wx.showToast({
        title: '请输入您的反馈内容',
        icon: 'none',
        duration: 1000
      })
      return false;
    }
    let _postParams = { remark: _remark };
    that.feedbackSubmit(_postParams);
  },

  /**
   * 将数据提交到后台
   */
  feedbackSubmit: function (options) {
    let that = this;
    let postParams = {};
    if (options != undefined) {
      postParams = options;
    }
    util.post(api.FeedbackUrl, postParams)
      .then(response => {
        let _data= response.data.data;
        console.log(_data);
        wx.showToast({
          title: '反馈成功',
          icon: 'success',
          duration: 1000
        })
        that.setData({
          is_submit: 1
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