// pages/my/comment/index.js
const api = require('../../../config/api.js');
const util = require('../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ResourceRootUrl: api.ResourceRootUrl,
    avatarRootUrl: api.ResourceRootUrl + '/storage/avatars/',
    commentList:{},
    is_hidden:true,
    commentContent: '',
    comment_default: '说点什么吧',
    footer_hidden: true,
    is_focus: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
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
    that.getCommentsList();
  },

  getCommentsList: function () {
    let that = this;
    util.post(api.GetMyCommentsUrl)
      .then(response => {
        let _data = response.data.data;
        console.log(_data)
        if (!_data || _data.length == 0) {
          return false;
        }
        that.setData({
          is_hidden: false,
          commentList: _data
        })
      });
  },

  replyDouble: function (e) {
    let that = this;
    let _nickname = e.currentTarget.dataset.nickname;
    let _linked_id = e.currentTarget.dataset.linked_id;
    let _is_reply = e.currentTarget.dataset.is_reply;
    let _comment_id;
    let _reply_id;
    if (_is_reply) {
      _comment_id = e.currentTarget.dataset.comment_id;
      _reply_id = e.currentTarget.dataset.id;
    } else {
      _comment_id = e.currentTarget.dataset.id;
      _reply_id = 0;
    }
    
    setTimeout(function(){
      that.setData({
        comment_default: '回复@' + _nickname,
        linked_id: _linked_id,
        comment_id: _comment_id,
        reply_id: _reply_id,
        is_focus: true,
        footer_hidden: false
      })
    },100)

  },


  changeContent: function (e) {
    let that = this;
    let value = e.detail.value;
    that.setData({
      commentContent: value
    })

  },

  commentPlay: function () {
    let that = this;
    let _content = that.data.commentContent;
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
      linked_id: that.data.linked_id,
      comment_id: that.data.comment_id,
      reply_id: that.data.reply_id
    }
    util.post(api.CommentReplyPlayUrl, params)
      .then(response => {
        wx.showToast({
          title: '操作成功',
          icon: 'none',
          duration: 1000
        })
        that.initialize();
      });
  },

  lostFocus: function () {
    let that = this;
    that.setData({
      is_focus: false,
      footer_hidden: true
    })
  },

  initialize: function () {
    let that = this;
    that.setData({
      commentContent: '',
      comment_default: '说点什么吧',
      comment_id: '',
      reply_id: ''
    })
  },

  goPage: function (e) {
    let that = this;
    let _url = e.currentTarget.dataset.url;
    wx.navigateTo({
      url: _url
    })
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