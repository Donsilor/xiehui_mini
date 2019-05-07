// pages/my/carte/create/index.js
const app = getApp();
const api = require('../../../../config/api.js');
const util = require('../../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ResourceRootUrl: api.ResourceRootUrl,
    type_arr: [],
    multiIndex: [0, 0],
    child_arr: {},
    industry_type_title: '请选择',
    current_address_title: '请输入您的公司地址',
    formSelectParams: {
      logo:'',
      industry_type: 0,
      longitude: '',
      latitude: '',
      address_title: '',
      address_name: ''
    },
    carteArr:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    that.getCarteSelect();
    if (options.id) {
      that.CarteDetailUrl(options.id);
    }
  },

  CarteDetailUrl: function (_id) {
    let that = this;
    util.post(api.CarteDetailUrl, { id: _id })
      .then(response => {
        let _data = response.data.data;
        console.log(_data);
        that.setData({
          'formSelectParams.id': _id,
          'formSelectParams.uid': _data.user_id,
          'formSelectParams.logo': _data.logo,
          'formSelectParams.industry_type': _data.industry_type,
          'formSelectParams.longitude': _data.longitude,
          'formSelectParams.latitude': _data.latitude,
          'formSelectParams.address_title': _data.address_title,
          'formSelectParams.address_name': _data.address_name,
          carteArr: _data,
          'current_address_title': _data.address_name
        })
        that.getCarteSelectOne(_data.industry_type)
      });
  },

  /**
     * 获取单个分类信息
     */
  getCarteSelectOne: function (industry_type_id) {
    let that = this;
    util.post(api.CarteSelectUrl, { id: industry_type_id })
      .then(response => {
        let _data = response.data.data;
        let _child_arr = that.data.child_arr;
        that.setData({
          'multiIndex[0]': _data.big_industry_type['key'],
          'multiIndex[1]': _data.industry_type['key'],
          'type_arr[1]': _child_arr[_data.industry_type['bk']],
          industry_type_title: _data.industry_type['name']
        });
      });
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

  UploadImage: function (event) {
    let that = this;
    util.fliesUpload().then((respond) => {
      let changeFieldStr = 'formSelectParams.logo';
      let uploadResponse = JSON.parse(respond.data);
      let _imagesData = uploadResponse.relative_url;
      that.setData({
        [changeFieldStr]: _imagesData,
      });
    }).catch((err) => {
      wx.showToast({
        title: '上传失败！',
        duration: 1000
      });
    })
  },

  bindMultiPickerChange: function (e) {
    let that = this;
    let _multiIndex = e.detail.value;
    let _child_arr = that.data.type_arr[1];
    that.setData({
      multiIndex: _multiIndex,
      industry_type_title: _child_arr[_multiIndex[1]]['name'],
      'formSelectParams.industry_type': _child_arr[_multiIndex[1]]['id']
    })
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


  /**
   * 地理位置
   * @param e
   */
  getChooseLocation: function (e) {
    let that = this;
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.userLocation']) {
          wx.authorize({
            scope: 'scope.userLocation',
            success(res) {
              that.setChooseLocation()
            }
          })
        } else {
          that.setChooseLocation()
        }
      }
    })

  },


  setChooseLocation: function () {
    let that = this;
    let longitudeStr = 'formSelectParams.longitude';
    let latitudeStr = 'formSelectParams.latitude';
    let addressTitleStr = 'formSelectParams.address_title';
    let addressInfoStr = 'formSelectParams.address_name';
    wx.chooseLocation({
      success: function (res) {
        console.log(res)
        that.setData({
          [longitudeStr]: res.longitude,
          [latitudeStr]: res.latitude,
          [addressTitleStr]: res.address,
          [addressInfoStr]: res.name,
          current_address_title: res.name,
        });
      },
      fail: function (res) {
        console.log(res)
      }
    });
  },



  formSubmit: function (e) {
    let that = this;
    let _formData = e.detail.value;
    let postData = Object.assign(_formData, that.data.formSelectParams);
    let _id = that.data.formSelectParams.id;
    let url = api.CarteCreateUrl;
    let success_title = '创建成功';
    if (_id) {
      url = api.CarteUpdateUrl;
      success_title = '更新成功';
    }
    util.post(url, postData)
      .then(response => {
        let _data = response.data.data;
        console.log(_data);
        wx.showToast({
          title: success_title,
          icon: 'none',
          duration: 500
        })
        setTimeout(function(){
          wx.navigateTo({
            url: '../index',
          })
        },500)
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
    let _phone = that.data.carteArr.phone;
    if (!_phone && app.globalData.mobile) {
      that.setData({
        'carteArr.phone': app.globalData.mobile
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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  }
})