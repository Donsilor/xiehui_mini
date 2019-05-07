// pages/my/personal/info/index.js
const api = require('../../../../config/api.js');
const util = require('../../../../utils/util.js');
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		ResourceRootUrl:api.ResourceRootUrl+'storage/avatars/',
		userInfo: {}
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		let that = this;
		// 获取用户信息
		util.get(api.UserInfoUrl, {}).then(respond => {
			let requestResponse = respond.data.data;
			that.setData({
				userInfo: requestResponse,
			});
			if (requestResponse.type == 1) {
				wx.showModal({
					title: '提示',
					content: '你还没有注册，是否注册',
					success(res) {
						if (res.confirm) {
							wx.navigateTo({
								url: '../../passport/register/index'
							})
						} else if (res.cancel) {
							wx.switchTab({
								url: '/pages/index/index'
							})
						}
					}
				});
			}
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
	},
	navigatorToUrl:function (e) {
		let _url = e.currentTarget.dataset.url;
		wx.navigateTo({
			url: _url
		})
	}
});