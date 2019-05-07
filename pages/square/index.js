// pages/square/index.js
const app = getApp();
const api = require('../../config/api.js');
const util = require('../../utils/util.js');
const QQMapWX = require('../../utils/qqmap-wx-jssdk.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ResourceRootUrl: api.ResourceRootUrl,
    avatarRootUrl: api.ResourceRootUrl + '/storage/avatars/',
    serviceList: {},
    demandList: {},
    currentTab:1,
    industry_type_arr:{},
    industry_type:0,
    demandScrollTop: 0,
    demandLoading: false,
    demandPage: 0,
    serviceScrollTop: 0,
    serviceLoading: false,
    servicePage: 0,
    city: '',
    keyword:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    that.setHeight();
    that.getServiceList();
    that.getDemandList();
    that.getServiceSelect();
    util.getUserLocationStatus();
    that.getFindXy();
    setTimeout(function () {
      wx.stopPullDownRefresh();
    }, 1000);
  },

  getServiceList: function () {
    let that = this;
    let _industry_type = that.data.industry_type;
    let _keyword = that.data.keyword;
    console.log(_industry_type)
    util.post(api.ServiceListUrl, { industry_type: _industry_type, searchKey: _keyword})
      .then(response => {
        let _data = response.data.data;
        console.log(_data)
        if (_data || _data.length == 0) {
          that.setData({
            serviceList: _data
          })
        }
      });
  },

  /**
     * 获取服务分类信息
     */
  getServiceSelect: function () {
    let that = this;
    util.post(api.ServiceSelectUrl, {})
      .then(response => {
        let _data = response.data.data;
        console.log(_data)
        that.setData({
          industry_type_arr: _data.big_industry_type
        });
      });
  },

  /**
   * 改变分类选项
   */
  changeIndustryType: function (e) {
    let that = this;
    let _industry_type = e.currentTarget.dataset.id;
    that.setData({
      industry_type: _industry_type,
      servicePage: 0,
      serviceLoading: false
    })
    that.getServiceList();
  },

  getDemandList: function () {
    let that = this;
    let _keyword = that.data.keyword;
    util.post(api.DemandListUrl, {searchKey: _keyword})
      .then(response => {
        let _data = response.data.data;
        console.log(_data)
        if (_data || _data.length == 0) {
          that.setData({
            demandList: _data
          })
        }
        
      });
  },


  clickTab: function (e) {
    let that = this;
    let _currentTab = e.currentTarget.dataset.current;
    that.setData({
      currentTab: _currentTab
    })
  },

  demandScroll: function (event) {
    this.setData({
      demandScrollTop: event.detail.scrollTop
    });
  },

  serviceScroll: function (event) {
    this.setData({
      serviceScrollTop: event.detail.scrollTop
    });
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

  serviceBindDownLoad: function () {
    let that = this;
    let _page = that.data.servicePage;
    let _serviceLoading = that.data.serviceLoading;
    let _industry_type = that.data.industry_type;
    let _keyword = that.data.keyword;
    if (_serviceLoading) {
      return false;
    }
    wx.showToast({
      title: '加载中...',
      icon: 'loading'
    })
    _page++;
    that.setData({
      servicePage: _page,
      serviceLoading: true
    })
    util.post(api.ServiceListUrl, { page: _page, industry_type: _industry_type, searchKey: _keyword})
      .then(response => {
        let _data = response.data.data;
        console.log(_data)
        let _length = Object.keys(_data).length;
        if (_length) {
          let _serviceList = that.data.serviceList;
          let _resArr = _serviceList.concat(_data);
          that.setData({
            serviceLoading: false,
            serviceList: _resArr
          })
        } else {
          wx.showToast({
            title: '已经到底了...',
            icon: 'none'
          })
        }

      });
  },

  demandBindDownLoad: function () {
    let that = this;
    let _page = that.data.demandPage;
    let _keyword = that.data.keyword;
    let _demandLoading = that.data.demandLoading;
    if (_demandLoading) {
      return false;
    }
    wx.showToast({
      title: '加载中...',
      icon: 'loading'
    })
    _page++;
    that.setData({
      demandPage: _page,
      demandLoading: true
    })
    util.post(api.DemandListUrl, { page: _page, searchKey: _keyword})
      .then(response => {
        let _data = response.data.data;
        console.log(_data)
        let _length = Object.keys(_data).length;
        if (_length) {
          let _demandList = that.data.demandList;
          let _resArr = _demandList.concat(_data);
          that.setData({
            demandLoading: false,
            demandList: _resArr
          })
        } else {
          wx.showToast({
            title: '已经到底了...',
            icon: 'none'
          })
        }

      });
  },


  gotoServiceDetail (e) {
    let that = this;
    let _id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../merchant/service/index?id=' + _id
    })
  },

  gotoDemandDetail (e) {
    let that = this;
    let _id = e.currentTarget.dataset.id;
    util.post(api.GetUserIntegral, { id: _id })
      .then(response => {
        wx.navigateTo({
          url: '../merchant/demand/index?id=' + _id
        })
      });
  },

  goSearch:function () {
    wx.navigateTo({
      url: '../search/index'
    })
  },

  getFindXy: function () {
    let that = this;
    wx.getLocation({
      success(res) {
        that.getLocal(res.latitude, res.longitude);
      }
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
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that = this;
    let _tab = app.globalData.square_tab;
    if (_tab) {
      app.globalData.square_tab = null;
      that.setData({
        currentTab: _tab
      })
    }
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