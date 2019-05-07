// pages/my/plaza/index.js
const api = require('../../../config/api.js');
const util = require('../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ResourceRootUrl: api.ResourceRootUrl,
    carteList:{},
    industry_type: 0,
    type_arr: [],
    multiIndex: [0, 0],
    area_type: 0,
    area_arr:[],
    areaIndex: [0, 0],
    industry_type_title: '所有行业',
    area_type_title:'所有地区'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    setTimeout(function(){
      that.getCarteSelect();
      that.getCitySelect();
    },500);
  },

  getCarteList: function () {
    let that = this;
    let _industry_type = that.data.industry_type;
    let _area_type = that.data.area_type;
    util.post(api.CarteListUrl, { industry_type: _industry_type, area_type: _area_type})
      .then(response => {
        let _data = response.data.data;
        console.log(_data)
        let _carteList = {};
        if (_data) {
          _carteList = _data;
        }
        that.setData({
          carteList: _carteList
        })
      });
  },

  defaultSort:function () {
    let that = this;
    that.setData({
      industry_type: 0,
      area_type:0
    });
    that.getCarteList();
  },

  /**
 * 获取行业分类信息
 */
  getCarteSelect: function () {
    let that = this;
    util.post(api.CarteSelectUrl, {})
      .then(response => {
        let _data = response.data.data;
        console.log(_data);
        that.setData({
          'type_arr[0]': _data.big_industry_type,
          'type_arr[1]': _data.industry_type[1],
          'child_arr': _data.industry_type
        });
      });
  },

  getCitySelect:function () {
    let that = this;
    util.post(api.CitySelectUrl, {})
      .then(response => {
        let _data = response.data.data;
         that.setData({
          'area_arr[0]': _data.province_type,
          'area_arr[1]': _data.city_type[1],
          'area_son_arr': _data.city_type
        });
      });
  },

  areaPickerChange: function (e) {
    let that = this;
    let _areaIndex = e.detail.value;
    let _area_son_arr = that.data.area_arr[1];
    that.setData({
      areaIndex: _areaIndex,
      area_type_title: _area_son_arr[_areaIndex[1]]['name'],
      area_type: _area_son_arr[_areaIndex[1]]['id']
    })
    that.getCarteList();
  },


  areaPickerColumnChange: function (e) {
    let that = this;
    let _key = e.detail.value;
    let _column = e.detail.column;
    let _currentData = that.data.area_arr[_column];
    let _selectId = _currentData[_key].id;
    let secondOptions = that.data.area_son_arr[_selectId]
    switch (_column) {
      // 第一列
      case 0:
        // 将属于当前类型的子集传给第二列
        that.setData({
          'area_arr[1]': secondOptions,
          'areaIndex[0]': _key,
          'areaIndex[1]': 0
        })
        break;
      case 1:
        // 将属于当前类型的子集传给第二列
        that.setData({
          'areaIndex[1]': _key,
        });
        break;
    }
  },


  bindMultiPickerChange: function (e) {
    let that = this;
    let _multiIndex = e.detail.value;
    let _child_arr = that.data.type_arr[1];
    that.setData({
      multiIndex: _multiIndex,
      industry_type_title: _child_arr[_multiIndex[1]]['name'],
      industry_type: _child_arr[_multiIndex[1]]['id']
    })
    that.getCarteList();
  },


  bindMultiPickerColumnChange: function (e) {
    let that = this;
    let _key = e.detail.value;
    let _column = e.detail.column;
    let _currentData = that.data.type_arr[_column];
    let _selectId = _currentData[_key].id;
    let secondOptions = that.data.child_arr[_selectId]
    switch (_column) {
      // 第一列
      case 0:
        // 将属于当前类型的子集传给第二列
        that.setData({
          'type_arr[1]': secondOptions,
          'multiIndex[0]': _key,
          'multiIndex[1]': 0
        })
        break;
      case 1:
        // 将属于当前类型的子集传给第二列
        that.setData({
          'multiIndex[1]': _key,
        });
        break;
    }
  },

  goPage: function (e) {
    let that = this;
    let _url = e.currentTarget.dataset.url;
    wx.navigateTo({
      url: _url
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
    that.getCarteList();
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