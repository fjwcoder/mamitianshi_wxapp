// pages/baby/chooseInjectposition.js
var App = getApp();
var WX_RAS = require('../../utils/rsa_public.js')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        id_name: null,
        indexArr: [0, 0, 0],
        multiArray: [],
        zhenArray: [{
            "name": "请先选择省市区"
        }],
        zhenIndex: 0, //乡镇选择器的索引
        showLoad: 1,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {

        // console.log(JSEncrypt)
        this.getProvince()
            // this.getEncryptKey()


        var pub_key = `-----BEGIN PUBLIC KEY-----
            MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDpoODVtnSztGyb//p+g/Ob36jb
            3jzWzS2qovOjpY/rrTjwlVcQpB2m1nZDQNpTFsG8ZBl7uPw3M81lr7NRRn6tY7Om
            8tbOOsRgY6u0xwbgdRStFFvwPzZ1HehiQ6WB8za8cucCyvuqmBRp7HOjO4Aa9t0r
            IvZ/hoWMeSvjnAVbMwIDAQAB
            -----END PUBLIC KEY-----`
        console.log(WX_RAS.jiami('中文Abc123.。@#', pub_key))


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
     * 提交
     */
    submitData: function(e) {
        if (!this.data.id_name) {
            wx.showModal({
                title: '提示',
                showCancel: false,
                content: '请您选择接种点',
                confirmText: '确定',
                confirmColor: '#3CC51F',
            });

        } else {
            wx.setStorage({
                key: 'inj_id_name',
                data: this.data.id_name,
                success: (result) => {
                    wx.navigateBack({
                        delta: 1
                    });
                },
            });
        }



    },
    /**
     * picker监听列改变
     */
    MultiColumnChange: function(e) {
        let _this = this
        _this.setData({
            list: null,
            zhenIndex: 0,
            zhenArray: null
        })
        if (e.detail.column === 0) { //如果改变的是省份
            var _pid = _this.data.multiArray[0][e.detail.value].id
            _this.data.pIndex = e.detail.value
            console.log(_this.data.pIndex)
            App._post_form("region/getCity", {
                pid: _pid
            }, function(res) {
                var zxc = _this.data.multiArray
                zxc[1] = res.data.city
                zxc[2] = res.data.district
                _this.setData({
                    multiArray: zxc,
                })

            })
            _this.setData({
                indexArr: [_this.data.pIndex, 0, 0]
            })
            console.log(_this.data.indexArr)
        }
        if (e.detail.column === 1) { //如果改变的是市
            var _pid = _this.data.multiArray[1][e.detail.value].id
            App._post_form("region/getCity", {
                pid: _pid
            }, function(res) {
                // return false;
                var zxc = _this.data.multiArray
                zxc[2] = res.data
                _this.setData({
                    multiArray: zxc,
                })
            })
            _this.setData({
                indexArr: [_this.data.pIndex, e.detail.value, 0]
            })
            console.log(_this.data.pIndex)

        }

        console.log(e)

    },
    /**
     * 选择地址(点击确定触发)
     */
    MultiChange: function(e) {
        let _this = this

        console.log(e)
        this.setData({
            showLoad: 1,
            indexArr: e.detail.value,
            usSheng: this.data.multiArray[0][e.detail.value[0]].id,
            usShi: this.data.multiArray[1][e.detail.value[1]].id,
            usQu: this.data.multiArray[2][e.detail.value[2]].id,
            ssqIndex: e.detail.value
        })
        console.log(_this.data.usQu)

        _this.geteInjectpositionList(_this.data.usQu)
            // App._post_form("region/getCity", {
            //     pid: this.data.usQu
            // }, function(res) {
            //     _this.setData({
            //         zhenArray: res.data,
            //         showLoad: false
            //     })
            // })

    },
    /**
     * 获取省份数据
     */
    getProvince: function() {
        let _this = this
        App._post_form("region/getCity", {
            pid: 0
        }, function(res) {
            console.log(res)
            var abc = []
            abc.push(res.data.province)
            abc.push(res.data.city)
            abc.push(res.data.district)
            console.log(abc)
            _this.setData({
                multiArray: abc,
                showLoad: false
            })
        })
    },
    /**
     * 单选框改变监听
     */
    radioFill: function(e) {
        var value = e.detail.value
        value.split(',')
        this.setData({
            id_name: value.split(",")
        })

    },
    /**
     * 获取相应街道下的接种点列表
     */
    geteInjectpositionList: function(id) {
        let _this = this
        this.setData({
            showModal: 1
        })
        App._post_form_ice("inpolist", {
            district: id
        }, res => {
            console.log(res)
            _this.setData({
                list: res.data,
                showLoad: false
            })
        })

    },
    /**
     * 选择乡镇/街道
     */
    zhenChange: function(e) {
        this.setData({
            list: null
        })
        console.log(this.data.zhenArray)
        this.setData({
            zhenIndex: e.detail.value,
            us_zhen: this.data.zhenArray[e.detail.value].id
        })
        this.geteInjectpositionList(this.data.us_zhen)
    },
    getEncryptKey: function() {
        let _this = this
        App._post_form("common/encryptKey", {}, res => {
            console.log(res)
            _this.setData({
                rsa_pub: res.data.rsa_pub,
                aes_key: res.data.aes_key
            })
        })
    },

})