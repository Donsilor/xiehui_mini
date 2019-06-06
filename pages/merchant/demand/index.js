// pages/merchant/demand/index.js
const api = require('../../../config/api.js');
const util = require('../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ResourceRootUrl: api.ResourceRootUrl,
    avatarRootUrl: api.ResourceRootUrl + '/storage/avatars/',
    detail: {},
    collectionStatus:false,
    collectionType:2,
    commentContent:'',
    comment_hidden: true,
    no_comment_hidden: true,
    commentList: {},
    comment_id:0,
    reply_id: 0,
    comment_default:'说点什么吧',
    is_focus:false,
    footer_hidden: true,
    nav_hidden:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    let _id = options.id;
    that.getDetail(_id);
    that.getCollectionStatus(_id);
    that.getCommentList(_id);
    that.prompt = that.selectComponent("#prompt"); 
  },

  getDetail: function (id) {
    let that = this;
    let _id = id;
    util.post(api.DemandViewUrl, { id: _id })
      .then(response => {
        let _data = response.data.data;
        console.log(_data)
        that.setData({
          detail: _data
        })
      });
  },

  makePhone: function (e) {
    let that = this;
    let phone = e.currentTarget.dataset.phone;
    wx.makePhoneCall({
      phoneNumber: phone
    })
  },

  /**
   * 查看登录用户是否已收藏
   */

  getCollectionStatus: function (_id) {
    let that = this;
    let postParams = {};
    postParams.type = that.data.collectionType;
    postParams.operation_id = _id;
    util.post(api.GetCollectionStatusUrl, postParams)
      .then(response => {
        let _data = response.data.data;
        console.log(_data)
        if (_data && _data.status == 1) {
          that.setData({
            collectionStatus: true
          })
        }
      });
  },

  /**
	   * 用户收藏
	   */
  clickCollection: function () {
    let that = this
    let postParams = {};
    postParams.operation_id = that.data.detail.id;
    postParams.type = that.data.collectionType;
    util.post(api.CollectionUrl, postParams)
      .then(response => {
        let status = that.data.collectionStatus;
        let _collectionStatus = true
        if (status) {
          _collectionStatus = false;
        }
        that.setData({
          collectionStatus: _collectionStatus
        })
        wx.showToast({
          title: '操作成功',
          icon: 'success',
          duration: 1000
        })
      });
  },

  /**
* 生命周期函数--监听页面初次渲染完成
*/
  onReady: function () {
    let that = this
    that.prompt = that.selectComponent("#prompt");
  },


  showDialog() {
    // console.log(this.prompt);
    this.prompt.showDialog();
  },
  //取消事件 
  _cancelEvent() {
    this.prompt.hideModal();
  },
  //确认事件 
  _confirmEvent() {
    let that = this
    let _remark = that.prompt.data.remark;
    let _relation_id = that.data.detail.id;
    let _type = that.data.collectionType;
    if (!_remark) {
      wx.showToast({
        title: '原因不能为空',
        icon: 'none',
        duration: 1000
      })
      return false;
    }

    util.post(api.AccusaUrl, { type: _type, remark: _remark, relation_id: _relation_id })
      .then(response => {
        let _accusa = response.data.data;
        // console.log(_accusa);
        if (_accusa.id) {
          wx.showToast({
            title: '举报成功',
            icon: 'success',
            duration: 1000
          })
        }

      });
    this.prompt.hideModal();
  },

  getCommentList: function (id) {
    let that = this;
    util.post(api.CommentListUrl, { linked_id: id})
      .then(response => {
        let _data = response.data.data;
        if (!_data || _data.length == 0) {
          that.setData({
            no_comment_hidden: false
          })
          return false;
        }
        console.log(_data)
        that.setData({
          no_comment_hidden:true,
          comment_hidden:false,
          commentList: _data
        })
      });
  },

  changeContent: function(e) {
    let that = this;
    let value = e.detail.value;
    that.setData({
      commentContent: value
    })
    
  },

  replyPlay: function (e) {
    let that = this;
    let _comment_id = e.currentTarget.dataset.id;
    let _nickname = e.currentTarget.dataset.nickname;
    console.log(_comment_id);
    setTimeout(function(){
      that.setData({
        comment_default: '回复@' + _nickname,
        comment_id: _comment_id,
        is_focus: true,
        nav_hidden: true,
        footer_hidden: false
      })
    },100)
    
  },

  replyDouble: function(e) {
    let that = this;
    let _comment_id = e.currentTarget.dataset.comment_id;
    let _reply_id = e.currentTarget.dataset.reply_id;
    let _nickname = e.currentTarget.dataset.nickname;
    console.log(e);
    setTimeout(function(){
      that.setData({
        comment_default: '回复@' + _nickname,
        comment_id: _comment_id,
        reply_id: _reply_id,
        is_focus: true,
        nav_hidden: true,
        footer_hidden: false
      })
    },100)
    
  },

  commentPlay: function () {
    let that = this;
    let _content = that.data.commentContent;
    let _comment_id = that.data.comment_id;
    if (!_content) {
      wx.showToast({
        title: '请输入内容',
        icon: 'none',
        duration: 1000
      })
      return false;
    }
    let params = {
      content: _content,
      linked_id: that.data.detail.id,
      comment_id: _comment_id,
      reply_id: that.data.reply_id
    }
    let _url = api.CommentPlayUrl;
    if (_comment_id > 0) {
      _url = api.CommentReplyPlayUrl;
    }
    util.post(_url, params)
      .then(response => {
        let _id = that.data.detail.id;
        wx.showToast({
          title: '操作成功',
          icon: 'none',
          duration: 1000
        })
        that.getCommentList(_id);
        that.initialize();
      });
  },

  writeReview:function () {
    let that = this;
    setTimeout(function(){
      that.setData({
        is_focus: true,
        nav_hidden: true,
        footer_hidden: false
      })
    },100)
    that.initialize();
  },

  lostFocus: function () {
    let that = this;
    that.setData({
      is_focus: false,
      footer_hidden: true,
      nav_hidden: false
    })
  },

  initialize:function () {
    let that = this;
    that.setData({
      commentContent:'',
      comment_default: '说点什么吧',
      comment_id: 0,
      reply_id: 0
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