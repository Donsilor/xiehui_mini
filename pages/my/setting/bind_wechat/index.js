// pages/my/setting/bind_wechat/index.js
const api = require('../../../../config/api.js');
const util = require('../../../../utils/util.js');
Page({

	/**
	 * 页面的初始数据
	 */
	data: {

	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		let that = this;
		util.get(api.UserInfoUrl, {}).then(respond => {
			let requestResponse = respond.data.data;
			that.setData({
				userInfo: requestResponse,
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

	},
	formSubmit:function (e) {
		let that = this;
		let _formData = e.detail.value;
		let postData = Object.assign(_formData);
		let url = api.UserInfoUpdateUrl;
		util.post(url,postData).then((response)=> {
			wx.showToast({
				title:'保存成功！',
				duration: 1000
			});
		})
	}
})