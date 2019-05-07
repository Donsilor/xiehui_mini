// pages/merchant/home/index.js
const api = require('../../../config/api.js');
const util = require('../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ResourceRootUrl: api.ResourceRootUrl,
    avatarRootUrl: api.ResourceRootUrl + '/storage/avatars/',
    shopDetail:{},
    serviceList:{},
    demandList:{},
    content_images:{},
    currentTab:1,
    business_distance:0,
    attentionStatus:false,
    attentionType:1,
    demandScrollTop:0,
    demandLoading:false,
    demandPage:0,
    serviceScrollTop: 0,
    serviceLoading: false,
    servicePage: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    let _id = options.id;
    that.setHeight();
    that.getShopDetail(_id);
    util.getUserLocationStatus();
  },

  getShopDetail: function (id) {
    let that = this;
    let _id = id;
    util.post(api.ShopAllDetailUrl, { id: _id})
      .then(response => {
        let _data = response.data.data;
        console.log(_data);
        that.setData({
          id: _id,
          shopDetail: _data,
          content_images: _data.content_images,
        });
        that.getServiceList(_data.user_id);
        that.getDemandList(_data.user_id);
        setTimeout(function () {
          that.getFindXy();
        },100)
      });
    that.getAttentionStatus(_id);
  },

  getServiceList: function (uid) {
    let that = this;
    let _uid = uid
    util.post(api.ServiceListUrl, { user_id: _uid})
      .then(response => {
        let _data = response.data.data;
        that.setData({
          serviceList: _data
        })
      });
  },

  getDemandList: function (uid) {
    let that = this;
    let _uid = uid
    let _page = that.data.demandPage;
    util.post(api.DemandListUrl, { user_id: _uid, page: _page })
      .then(response => {
        let _data = response.data.data;
        console.log(_data)
        that.setData({
          demandList: _data
        })
      });
  },

  clickTab: function (e) {
    let that = this;
    let _currentTab = e.currentTarget.dataset.current;
    that.setData({
      currentTab: _currentTab
    })
  },

  getFindXy: function() { //获取用户的经纬度
    let that = this
    util.findXy().then(response => {
      let lat1 = response.latitude;
      let lng1 = response.longitude;
      let lat2 = that.data.shopDetail.latitude;
      let lng2 = that.data.shopDetail.longitude;
      let _business_distance = util.getDistance(lat1, lng1, lat2, lng2);
      that.setData({
        business_distance: _business_distance
      })
    })
  },

  /**
   * 查看用户是否关注
   */
  getAttentionStatus: function (_id) {
    let that = this;
    let _type = that.data.attentionType;
    util.post(api.AttentionStatusUrl, { operation_id: _id, type: _type })
      .then(response => {
        let _data = response.data.data;
        if (_data && _data.status == 1) {
          that.setData({
            attentionStatus: true
          })
        }
      });
  },

  /**
   * 关注
   */
  changeAttention: function () {
    let that = this;
    let status = true;
    let _id = that.data.id;
    let _type = that.data.attentionType;
    let _shop_user_id = that.data.shopDetail.user_id;
    util.post(api.AttentionUrl, { operation_id: _id, type: _type, uid: _shop_user_id})
      .then(response => {
        if (that.data.attentionStatus) {
          status = false;
        }
        wx.showToast({
          title: '操作成功',
          icon: 'success',
          duration: 2000
        })
        that.setData({
          attentionStatus: status
        })
      });
    
  },

  gotoServiceDetail(e) {
    let that = this;
    let _id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../service/index?id=' + _id
    })
  },

  gotoDemandDetail(e) {
    let that = this;
    let _id = e.currentTarget.dataset.id;
    util.post(api.GetUserIntegral, { id: _id })
      .then(response => {
        wx.navigateTo({
          url: '../demand/index?id=' + _id
        })
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

  demandBindDownLoad: function () {
    let that = this;
    let _page = that.data.demandPage;
    let _uid = that.data.shopDetail.user_id;
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
    util.post(api.DemandListUrl, { user_id: _uid, page: _page })
      .then(response => {
        let _data = response.data.data;
        console.log(_data)
        let _length = Object.keys(_data).length;
        if (_length) {
          let _demandList = that.data.demandList;
          let _resArr = _demandList.concat(_data);
          that.setData({
            demandLoading:false,
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

  serviceBindDownLoad: function () {
    let that = this;
    let _page = that.data.servicePage;
    let _uid = that.data.shopDetail.user_id;
    let _serviceLoading = that.data.serviceLoading;
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
    util.post(api.ServiceListUrl, { user_id: _uid, page: _page })
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