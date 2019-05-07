// pages/my/personal/authinfo/index.js
const api = require('../../../../config/api.js');
const util = require('../../../../utils/util.js');
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		ResourceRootUrl:api.ResourceRootUrl,
		userApplyInfo: {}
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		let that = this;
		// 检查用户是否已经提交注册申请
		util.post(api.UserAuthInfo, {}).then(res => {
			let responseData = res.data.data;
			this.setData({
				userApplyInfo: responseData
			});
		}).catch((err) => {

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

	},
	navigatorToUrl:function (e) {
		let _url = e.currentTarget.dataset.url;
		wx.navigateTo({
			url: _url
		})
	}
});