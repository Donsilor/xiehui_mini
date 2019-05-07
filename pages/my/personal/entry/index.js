// pages/my/personal/entry/index.js
const api = require('../../../../config/api.js');
const util = require('../../../../utils/util.js');
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		name:'',
		enterprises:{}
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
    util.userShare();
	},

	bindKeyInput: function (e) {
		this.setData({
			name: e.detail.value
		})
	},

	searchEnterprise:function(){
		let that = this;
		let _searchName = that.data.name;
		that.getEnterpriseLists({name:_searchName})
	},

	getEnterpriseLists: function (options) {
		let that = this;
		let postParams = {};
		if(options != undefined){
			postParams = options;
		}
		util.post(api.EnterpriseUserListsUrl,postParams)
			.then(response => {
				let _enterprises = response.data.data;
				console.log(_enterprises);
				that.setData({
					enterprises:_enterprises
				});
			});
	},

	entryApply: function (options) {
		let that = this;
		let _id = options.currentTarget.dataset.id;
		let postParams = {id:_id};
		util.post(api.EnterpriseUserListsUrl,postParams)
			.then(response => {
				wx.showToast({
					title:'申请成功',
					duration: 1000,
					success:function () {
						wx.switchTab({
							url: '/pages/my/index/index'
						})
					}
				});
			});
	},
})