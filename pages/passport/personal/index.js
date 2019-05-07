const api = require('../../../config/api.js');
const util = require('../../../utils/util.js');
const app = getApp()

Page({
    data:{
        ResourceRootUrl:api.ResourceRootUrl,
        previewImages:{
            sfz_z:'',
            sfz_f:'',
            sfz_sc:'',
            certificate:'',
        },
        registerType:1
    },
    onLoad: function (options) {
        let that = this;
        let currentType = options.type;
        that.setData({
            registerType : currentType,
        });
        // 检查用户是否已经注册相关角色，如果没有注册，则跳转到角色注册界面
        /*util.get(api.BuildingLists, {}).then(res => {
            if (res.statusCode === 200) {
                console.log('res.statusCode === 200');
                console.log(res)
            }
        }).catch((err) => {
            reject(err);
        });*/
    },

    UploadImage: function (event) {
        let that = this;
        console.log('aaaaaaaaaaaaaaaaaaaa')
        let _type = event.currentTarget.dataset.imageType;
        util.fliesUpload().then((respond) => {
            console.log(respond);
            let changeFieldStr = 'previewImages.'+_type;
            let uploadResponse = JSON.parse(respond.data);
            console.log(uploadResponse.url);
            //do something
            that.setData({
                [changeFieldStr] : uploadResponse.relative_url,
            });
        }).catch((err) => {
            wx.showToast({
                title:'上传失败！',
                duration: 1000
            });
        })
    },

    formSubmit:function (e) {
        let that = this;
        let _formData = e.detail.value;
        let postData = Object.assign(_formData, that.data.previewImages,{type:that.data.registerType});
        let url = api.PersonalUserAuth;
        util.post(url,postData).then((response)=> {
            console.log(111);
            wx.showToast({
                title:'提交成功！',
                duration: 1000
            });
        })
    }
})
