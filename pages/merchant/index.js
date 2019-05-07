// pages/shop/index.js
const api = require('../../config/api.js');
const util = require('../../utils/util.js');
const QQMapWX = require('../../utils/qqmap-wx-jssdk.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ResourceRootUrl: api.ResourceRootUrl,
    city: '',
    shopList:{},
    enter_type_arr:{},
    enter_type:0,
    shopScrollTop: 0,
    shopLoading: false,
    shopPage: 0,
    keyword:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    that.setHeight();
    util.getUserLocationStatus();
    that.getShopSelect();
    that.getFindXy();
    setTimeout(function() {
      that.getShopList();
    },100);
    setTimeout(function() {
      wx.stopPullDownRefresh();
    },1000);
    
  },

  getShopList: function () {
    let that = this;
    let _enter_type = that.data.enter_type;
    let _keyword = that.data.keyword;
    util.post(api.ShopListUrl, { enter_type: _enter_type, searchKey: _keyword})
      .then(response => {
        let _shopList = response.data.data;
        let lat1 = that.data.current_latitude;
        let lng1 = that.data.current_longitude;
        for (let index in _shopList) {
          let lat2 = _shopList[index]['latitude'];
          let lng2 = _shopList[index]['longitude'];
          _shopList[index]['business_distance'] = util.getDistance(lat1, lng1, lat2, lng2);
        }
        console.log(_shopList)
        setTimeout(function(){
          that.setData({
            shopList: _shopList
          })
        },1000);
      });
  },
  
  getFindXy: function () { //获取用户的经纬度
    let that = this
    util.findXy().then(response => {
      that.setData({
        current_latitude: response.latitude,
        current_longitude: response.longitude
      })
      that.getLocal(response.latitude, response.longitude);
    })
  },

  goSearch: function () {
    wx.navigateTo({
      url: '../search/index'
    })
  },

  // 获取当前地理位置
  getLocal: function (latitude, longitude) {
    let that = this;
    let qqmapsdk = new QQMapWX({
      key: api.QqmapsdkKey
    });
    qqmapsdk.reverseGeocoder({
      location: {
        latitude: latitude,
        longitude: longitude
      },
      success: function (res) {
        // console.log(JSON.stringify(res));
        let province = res.result.ad_info.province
        let city = res.result.ad_info.city
        that.setData({
          province: province,
          city: city,
          latitude: latitude,
          longitude: longitude
        })

      },
      fail: function (res) {
        console.log(res);
      },
      complete: function (res) {
        // console.log(res);
      }
    });
  },

  /**
     * 获取入驻分类信息
     */
  getShopSelect: function () {
    let that = this;
    util.post(api.ShopSelectUrl, {})
      .then(response => {
        let _data = response.data.data;
        that.setData({
          enter_type_arr: _data.big_enter_type
        });
      });
  },

  /**
   * 改变分类选项
   */
  changeEnterType: function (e) {
    let that = this;
    let _enter_type = e.currentTarget.dataset.id;
    that.setData({
      enter_type: _enter_type,
      shopPage:0,
      shopLoading: false
    })
    that.getShopList();
  },

  gotoHome: function (e) {
    let that = this;
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: 'home/index?id=' + id
    })
  },

  setHeight: function () {
    let that = this;
    wx.getSystemInfo({
      success: function (res) {
        console.log(res)
        that.setData({
          scrollHeight: res.windowHeight
        });
      }
    });
  },

  shopScroll: function (event) {
    this.setData({
      shopScrollTop: event.detail.scrollTop
    });
  },

  shopBindDownLoad: function () {
    let that = this;
    let _page = that.data.shopPage;
    let _keyword = that.data.keyword;
    let _enter_type = that.data.enter_type;
    let _shopLoading = that.data.shopLoading;
    if (_shopLoading) {
      return false;
    }
    wx.showToast({
      title: '加载中...',
      icon: 'loading'
    })
    _page++;
    that.setData({
      shopPage: _page,
      shopLoading: true
    })
    util.post(api.ShopListUrl, { enter_type: _enter_type, page: _page, searchKey: _keyword})
      .then(response => {
        let _data = response.data.data;
        console.log(_data)
        let _length = Object.keys(_data).length;
        if (_length) {
          let _shopList = that.data.shopList;
          let _resArr = _shopList.concat(_data);
          that.setData({
            shopLoading: false,
            shopList: _resArr
          })
        } else {
          wx.showToast({
            title: '已经到底了...',
            icon: 'none'
          })
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
    var that = this;
    that.onLoad();
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