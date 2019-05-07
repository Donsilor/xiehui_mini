// pages/my/member/office/index.js
const api = require('../../../../config/api.js');
const util = require('../../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    member: {},
    officeList: {},
    office_title:'请选择',
    money:'',
    iswxpay:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    let _memberType = options.type;
    that.setData({
      memberType: _memberType
    });
    that.getMember();
    that.getOfficeList();
  },

  getOfficeList: function () {
    let that = this;
    util.post(api.OfficeListUrl)
      .then(response => {
        let _data = response.data.data;
        console.log(_data)
        that.setData({
          officeList: _data
        });
      });
  },

  bindPickerChange: function (e) {
    let that = this;
    let _key = e.detail.value;
    let _officeList = that.data.officeList;
    that.setData({
      office_id: _officeList[_key]['id'],
      office_title: _officeList[_key]['office_name']
    })
  },

  getMember: function () {
    let that = this;
    util.post(api.GetMemberUrl)
      .then(response => {
        let _data = response.data.data;
        let _memberType = that.data.memberType;
        let _money = _data.money_two;
        if (_memberType == 2) {
          _money = _data.money_one;
        }
        console.log(_data)
        that.setData({
          member: _data,
          money: _money
        });
      });
  },

  wxPay: function () {
    let that = this;
    let _office_id = that.data.office_id;
    if (!_office_id) {
      wx.showToast({
        title: '请选择办事处',
        icon: 'none',
        duration: 500
      });
      return false;
    }
    let params = {
      type: that.data.memberType,
      office_id: _office_id,
      paid_type: 'WXPAY'
    }
    wx.showModal({
      title: '提示',
      content: '确定要微信支付购买此会员吗？',
      success(res) {
        if (res.confirm) {
          if (that.data.iswxpay == 0) {
            that.setData({
              iswxpay: true
            })
            util.post(api.OrderPayUrl, params)
              .then(response => {
                let _data = response.data;
                if (_data.status) {
                  that.Payment(_data.data);
                }
              });
          }
        } else {
          that.setData({
            iswxpay: false
          })
          console.log('取消微信支付')
        }
      }
    })
  },

  Payment: function (data) {
    let that = this;
    wx.requestPayment({
      'timeStamp': String(data.timeStamp),
      'nonceStr': data.nonceStr,
      'package': data.package,
      'signType': data.signType,
      'paySign': data.paySign,
      'success': function (res) {
        let params = {
          type: that.data.memberType,
          office_id: that.data.office_id,
          order_no: data.order_no
        }
        util.post(api.ChangeUserUrl, params)
            .then(response => {
              let _data = response.data.data;
              console.log(_data)
              wx.showToast({
                title: '开通成功',
                icon: 'none',
                duration: 500
              });
              setTimeout(function() {
                wx.switchTab({
                  url: '../../index/index',
                })
              },500);
            });
      },
      'fail': function (res) {
        wx.showToast({ title: '支付失败', icon: 'loading', duration: 2000 });
      }
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