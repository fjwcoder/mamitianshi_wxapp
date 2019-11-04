// pages/baby/addBaby.js
let App = getApp();



Page({

    /**
     * 页面的初始数据
     */
    data: {
        birthDate: '请选择',
        today: App.year + '/' + App.month + '/' + App.day,
        vac_place: null, //表单展示的接种点名称
        inject_position_id: null, //接种点ID
        baby_id: 0,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        console.log(App.encrypt("中文Abc123，"))
        console.log(JSON.parse(App.decrypt('T1ut/i0edCMqu4Mc7EYikw==')))
            // console.log(qwe.Decrypt("11886B8DE189AF142022ED7B81FFD4D9"))
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {
        wx.getStorage({
            key: 'inj_id_name',
            success: (result) => {
                this.setData({
                    inject_position_id: result.data[0],
                    vac_place: result.data[1]
                })
                console.log(this.data)
                wx.removeStorage({
                    key: 'inj_id_name'
                });

            },

        });
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    },

    /**
     * 跳转选择接种点页面
     */
    jumpChooseInjectposition: function() {
        wx.navigateTo({
            url: 'chooseInjectposition',
            success: (result) => {

            },
        });
    },

    /**
     * 选择出生日期
     */
    birthDateChange(e) {
        this.setData({
            birthDate: e.detail.value
        })
    },
    /**
     * 表单提交
     */
    submitData: function(e) {
        var values = e.detail.value
        values.baby_sex ? values.baby_sex = 1 : values.baby_sex = 2
        values.inject_position_id = this.data.inject_position_id
        values.baby_id = this.data.baby_id


        // 表单验证
        if (!this.validation(values)) {
            App.showError(this.data.error);
            return false
        }


        console.log(values)
        
        App._post_form("baby/editBabyInfo", {
            data: App.encrypt(JSON.stringify(values))
        }, res => {
            console.log(res)
            if (res.code === 200) {
                wx.showToast({
                    title: '添加成功',
                    icon: 'success',
                    duration: 1500,
                    mask: true,
                    success: res => {
                        setTimeout(function() {
                            wx.navigateBack({
                                delta: 1
                            })
                        }, 1500);
                    }
                });
            }
        })
    },
    /**
     * 表单验证
     */
    validation: function(v) {
        if (v.baby_name === '' || v.baby_name.length < 2) {
            this.data.error = '请输入宝宝姓名';
            return false;
        }
        if (v.father_name === '' || v.father_name.length < 2) {
            this.data.error = '请输入父亲姓名';
            return false;
        }
        if (v.mother_name === '' || v.mother_name.length < 2) {
            this.data.error = '请输入母亲姓名';
            return false;
        }
        if (v.urgent_name === '' || v.urgent_name.length < 2) {
            this.data.error = '请正确输入紧急联系人姓名';
            return false;
        }
        let reg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
        if (!reg.test(v.urgent_mobile)) {
            this.data.error = '手机号不符合要求';
            return false;
        }
        let idcardReg = /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/;
        if (!idcardReg.test(v.baby_id_card)) {
            this.data.error = '身份证号不合规范'
            return false;
        }
        if (v.baby_birth_date === '请选择') {
            this.data.error = '请选择宝宝的出生日期';
            return false;
        }
        if (v.inject_position_id === null) {
            this.data.error = '请选择接种点';
            return false;
        }
        return true;
    },
})