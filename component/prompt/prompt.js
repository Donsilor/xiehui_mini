// pages/common/pop/pop.js
Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持 
  },
  /** 
   * 组件的属性列表 
   * 用于组件自定义设置 
  */
  properties: {
    title: { // 属性名 
      type: String, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型） 
      value: '标题' // 属性初始值（可选），如果未指定则会根据类型选择一个 
    },
    // placeholder默认值
    placeholder: { type: String, value: '默认值' },
    // 弹窗内容 
    content: { type: String, value: '弹窗内容' },
    // 弹窗取消按钮文字 
    cancelText: { type: String, value: '取消' },
    // 弹窗确认按钮文字 
    confirmText: { type: String, value: '确定' }
  },
  /** 
   * 私有数据,组件的初始数据 
   * 可用于模版渲染 
   */
  data: { // 弹窗显示控制 
    showModal: false,
    remark:''
  },
  /**
   * 组件的方法列表 
   * 更新属性和数据的方法与更新页面数据的方法类似 
  */
  methods: {
    
    /**
   * 展示或隐藏模态框
   */
    showDialog: function () {
      this.setData({
        showModal: true
      })
    },

    /**
     * 隐藏模态框
     */
    hideModal: function () {
      this.setData({
        showModal: false
      })
    },

    /**
     * 随时更新说明
     */
    inputChange: function (e) {
      this.setData({
        remark: e.detail.value
      })
    },

    _cancelEvent() { //触发取消回调 
      this.triggerEvent("cancelEvent")
    },
    
    _confirmEvent() { //触发成功回调 
      this.triggerEvent("confirmEvent");
    } 
  }
})