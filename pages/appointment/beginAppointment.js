// pages/appointment/beginAppointment.js
// var WxParse = require('../../wxParse/wxParse.js');
var utilsDate = require("../../utils/utilsDate.js")
let App = getApp();


Page({

    /**
     * 页面的初始数据
     */
    data: {
        index: null,
        showLoad: 1,
        show: false,
        today: App.year + '/' + App.month + '/' + App.day,
        specify_begin_date: null, //规定开始预约日期，当前日期+1天
        specify_end_date: null, //规定结束预约日期，当前日期+4天
        bDate: null, //用户选择的预约开始日期
        eDate: null, //用户选择的预约结束日期
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        console.log(options);
        if (options.baby_id) {
            this.getBabyListA(parseInt(options.baby_id))

        } else {
            wx.showToast({
                title: '请先选择您要预约接种的宝宝',
                icon: 'none',
                image: '',
                duration: 1500,
                mask: false,
            });
            this.getBabyList()
        }
        this.setData({
            specify_begin_date: utilsDate.mathChangeDate(this.data.today, '+', 1),
            specify_end_date: utilsDate.mathChangeDate(this.data.today, '+', 4),
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

        wx.getStorage({
            key: 'inj_id_name',
            success: (result) => {
                this.setData({
                    inject_position_id: result.data[0],
                    inj_p_name: result.data[1]
                })
                console.log(this.data)
                wx.removeStorage({
                    key: 'inj_id_name'
                });
            },
            fail: (e) => {
                console.log(e)
            }

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

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },
    /**
     * 获取宝宝列表（指定baby情况）
     */
    getBabyListA: function (baby_id) {
        let _this = this
        App._post_form("baby/getBabyList", {}, res => {
            var resData = JSON.parse(App.decrypt(res.data))
            console.log(resData)
            var idx = null
            var inject_position_id = null

            for (var i = 0; i < resData.length; i++) {
                if (resData[i].id === baby_id) {
                    inject_position_id = resData[i].inject_position_id
                    idx = i
                    break
                }
            }
            _this.setData({
                babyList: resData,
                index: idx,
                inject_position_id: inject_position_id
            })
            App._post_form_ice("inpoinfo", { //获取接种点信息
                id: inject_position_id
            }, result => {
                console.log(result)
                _this.setData({
                    inj_p_name: result.data.name
                })
            })
            var _data = App.encrypt(JSON.stringify({
                baby_id: baby_id,
            }))
            App._post_form('baby/getBabyVaccineInfo', {
                data: _data
            }, res => {
                console.log(res)
                var resData = JSON.parse(App.decrypt(res.data))
                var v_id_text = _this.getVIdText(resData.vaccine_list)
                console.log(resData)
                _this.setData({
                    vacList: resData.vaccine_list,
                    v_id_text: v_id_text,
                    nextInjDate: resData.vaccine_date,
                    baby_id: baby_id,
                    showLoad: false
                })

                console.log(v_id_text)

            })
        })
    },
    /**
     * 获取宝宝列表
     */
    getBabyList: function () {
        let _this = this
        App._post_form("baby/getBabyList", {}, res => {
            console.log(res)
            var resData = JSON.parse(App.decrypt(res.data))
            console.log(resData)
            if (resData[0] == undefined) {
                _this.setData({
                    showLoad: false
                })
                wx.showModal({
                    title: '提示',
                    content: '您还没有添加您的宝宝信息',
                    showCancel: true,
                    cancelText: '取消',
                    cancelColor: '#000000',
                    confirmText: '去添加',
                    confirmColor: '#3CC51F',
                    success: (result) => {
                        if (result.confirm) {
                            wx.redirectTo({
                                url: '../baby/addBaby',
                            });
                        } else if (result.cancel) {
                            wx.navigateBack({
                                delta: 1
                            });
                        }
                    },
                    fail: () => {},
                    complete: () => {}
                });
            } else {
                _this.setData({
                    babyList: resData,
                    showLoad: false
                })
            }
        })
    },
    /**
     * 选择baby
     */
    chooseBaby: function (e) {
        let _this = this
        _this.setData({
            showLoad: 1,
            index: e.detail.value,
            baby_id: _this.data.babyList[e.detail.value].id,
            inject_position_id: _this.data.babyList[e.detail.value].inject_position_id
        })
        var _data = App.encrypt(JSON.stringify({
            baby_id: _this.data.baby_id,

        }))

        // App._post_form('vaccine/getWeekVaccineInfo',{week:312},res=>{
        //   console.log(res)
        //   var resData =res.data
        //   _this.setData({
        //     vacList:resData
        //   })
        App._post_form_ice("inpoinfo", {
            id: _this.data.inject_position_id
        }, result => {
            console.log(result)
            _this.setData({
                inj_p_name: result.data.name
            })
        })

        App._post_form('baby/getBabyVaccineInfo', {
            data: _data
        }, res => {
            console.log(res)
            var resData = JSON.parse(App.decrypt(res.data))
            var v_id_text = _this.getVIdText(resData.vaccine_list)
            console.log(resData)
            _this.setData({
                vacList: resData.vaccine_list,
                v_id_text: v_id_text,
                nextInjDate: resData.vaccine_date,
                showLoad: false
            })

            console.log(v_id_text)
            // for (var i = 0; i < resData.length; i++) {
            //   console.log(i)
            //   WxParse.wxParse('vacText' + i, 'html', resData[i].vaccine_text, _this);
            //   if (i === resData.length - 1) {
            //     WxParse.wxParseTemArray("vacTextArr", 'vacText', resData.length, _this)
            //   }
            // }
        })

    },
    /**
     * 跳转选择接种点页面
     */
    jumpChooseInjectposition: function () {
        wx.navigateTo({
            url: '../baby/chooseInjectposition',
            success: (result) => {

            },
        });
    },
    /**
     * 点击显示(隐藏)疫苗简介
     */
    showVacModal: function () {
        this.setData({
            show: 1
        })
    },
    hideModal: function () {
        this.setData({
            show: false
        })
    },
    /**
     * 选择日期(起始日期)
     */
    beginDateChange(e) {
        this.setData({
            bDate: e.detail.value
        })
    },
    /**
     * 选择日期(截止日期)
     */
    endDateChange(e) {
        this.setData({
            eDate: e.detail.value
        })
    },
    /**
     * 提交数据
     */
    submitData: function () {
        let _this = this;
        if (!_this.validation(_this.data)) {
            App.showError(_this.data.error);
            return false
        }
        var _data = App.encrypt(JSON.stringify({
            b_id: _this.data.baby_id,
            v_id: _this.data.v_id_text,
            yu_time: _this.data.bDate,
            yu_endtime: _this.data.eDate,
            i_p_id: _this.data.inject_position_id
        }))
        App._post_form("vaccine/vaccineAppointment", {
            data: _data
        }, res => {
            if (res.code !== 200) {
                wx.showModal({
                    title: '提示',
                    content: res.msg,
                    showCancel: false,
                    confirmText: '确定',
                    confirmColor: '#3CC51F',
                    success: (result) => {
                        if (result.confirm) {

                        }
                    },
                });
            }
            if (res.code === 200) {
                wx.redirectTo({
                    url: 'appointmentSuccess',
                });
            }
            console.log(res)
        })
    },
    /**
     * 遍历取出所有v_id,拼接成字符串
     */
    getVIdText: function (data) {
        var v_id_text = ''
        for (var i = 0; i < data.length; i++) {
            if (i === 0) {
                v_id_text = data[i].v_id
            } else {
                v_id_text = v_id_text + ',' + data[i].v_id
            }
        }
        return v_id_text
    },
    /**
     * 表单验证
     */
    validation: function (v) {
        if (v.bDate === null || v.eDate === null) {
            this.data.error = '请选择您的预约开始和结束日期';
            return false;
        }
        if (v.bDate > v.eDate) {
            this.data.error = '预约开始日期不可大于结束日期';
            return false;
        }

        return true;
    },
})