// pages/my/help/index.js
const app = getApp();
const api = require('../../../../config/api.js');
const util = require('../../../../utils/util.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        ResourceRootUrl:api.ResourceRootUrl,
        previewImages:{
          logo_images:'',
          carousel_images:[],
          content_images:[],
        },
        type_arr:[],
        multiIndex:[0,0],
        child_arr:{},
        enter_type_title:'请选择',
        current_address_title:'设置定位',
        formSelectParams:{
            enter_type:0,
            longitude:'',
            latitude:'',
            address_title:'',
            address_name:'',
            sex:1
        },
        carouselTotalNum:5,
        contentTotalNum:5,
        shopArr:{}
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
      let that = this;
      that.getShopSelect();
      if (options.id) {
          that.getShopDetail(options.id);
      }
    },

    getShopDetail: function (_id) {
        let that = this;
        util.post(api.ShopDetailUrl, {id:_id})
            .then(response => {
                let _data = response.data.data;
              console.log(_data)
                that.setData({
                    'formSelectParams.id':_id,
                    'formSelectParams.uid': _data.user_id,
                    'formSelectParams.enter_type': _data.enter_type,
                    'formSelectParams.longitude': _data.longitude,
                    'formSelectParams.latitude': _data.latitude,
                    'formSelectParams.address_title': _data.address_title,
                    'formSelectParams.address_name': _data.address_name,
                    shopArr:_data,
                    'previewImages.logo_images':_data.logo,
                    'previewImages.carousel_images':_data.carousel_images,
                    'previewImages.content_images':_data.content_images,
                    'current_address_title': _data.address_name
                })
                setTimeout(function() {
                  that.getShopSelectOne(_data.enter_type)
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
      let _phone = that.data.shopArr.phone;
      if (!_phone && app.globalData.mobile) {
        that.setData({
          'shopArr.phone': app.globalData.mobile
        })
      }
    },


    formSubmit:function (e) {
        let that = this;
        let _formData = e.detail.value;
        let postData = Object.assign(_formData, that.data.previewImages,that.data.formSelectParams);
        let _id = that.data.formSelectParams.id;
        let url = api.ShopCreateUrl;
        let success_title = '创建成功';
        if (_id) {
          url = api.ShopUpdateUrl;
          success_title = '更新成功';
        }
      util.post(url, postData)
            .then(response => {
                let _data = response.data.data;
                console.log(_data);
                wx.showToast({
                  title: success_title,
                  icon: 'none',
                  duration: 1000
                })
              wx.navigateTo({
                url: '../index',
              })
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
                  'type_arr[0]': _data.big_enter_type,
                  'type_arr[1]': _data.enter_type[1],
                  'child_arr': _data.enter_type
                });
            });
    },

  bindMultiPickerChange: function (e) {
    let that = this;
    let _multiIndex = e.detail.value;
    let _child_arr = that.data.type_arr[1];
    that.setData({
      multiIndex: _multiIndex,
      enter_type_title: _child_arr[_multiIndex[1]]['name'],
      'formSelectParams.enter_type': _child_arr[_multiIndex[1]]['id']
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
     * 获取单个分类信息
     */
  getShopSelectOne: function (child_type_id) {
      let that = this;
      util.post(api.ShopSelectUrl, { id: child_type_id })
        .then(response => {
          let _data = response.data.data;
          let _child_arr = that.data.child_arr;
          that.setData({
            'multiIndex[0]': _data.big_enter_type['key'],
            'multiIndex[1]': _data.enter_type['key'],
            'type_arr[1]': _child_arr[_data.enter_type['bk']],
            enter_type_title: _data.enter_type['name']
          });
        });
    },

    sexRadioChange: function (e) {
        let that = this;
        that.setData({
            'formSelectParams.sex':e.detail.value
        })
    },

    /**
     * 地理位置
     * @param e
     */
    getChooseLocation:function (e) {
        let that = this;  
        wx.getSetting({
          success(res) {
            console.log(res)
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

    UploadImage: function (event) {
        let that = this;
        let _type = event.currentTarget.dataset.imageType;
        let currentType = _type+'TotalNum';
        let currentImgType = _type + '_images';
        let currentImages = that.data.previewImages[currentImgType];
        let currentNum = currentImages.length;
        let totalNum = that.data[currentType];
        if (currentNum >= totalNum) {
            wx.showToast({
                title:'最多只能上传'+totalNum+'张图片！',
                duration: 1000
            });
            return false;
        }
        let lastNum = totalNum - currentNum;
        if (_type == 'logo') {
          lastNum = 1;
        }
      util.multipartFliesUpload(lastNum).then((respond) => {
        let uploadUrlData = respond;
        let changeFieldStr = 'previewImages.' + currentImgType;
        let _imagesData = uploadUrlData[0];
        if (_type != 'logo') {
          _imagesData = currentImages.concat(uploadUrlData);
        } 
        console.log(uploadUrlData);
        that.setData({
          [changeFieldStr]: _imagesData,
        });
        wx.showToast({
          title: '上传成功',
          duration: 1000
        });
      }).catch((err) => {
        console.log(err)
        wx.showToast({
          title: '上传失败！',
          duration: 1000
        });
      })
    },

    DeleteImage: function (event) {
        console.log('444');
        let that = this;
        let _type = event.currentTarget.dataset.imageType;
        let currentImgType = _type + '_images';
        let _key = event.currentTarget.dataset.id;
        let _imagesData = that.data.previewImages[currentImgType];
        let changeFieldStr = 'previewImages.' + currentImgType;
        _imagesData.splice(_key, 1);
        that.setData({
            [changeFieldStr] : _imagesData,
        });
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