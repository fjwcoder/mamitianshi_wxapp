// pages/find/babyGrowthRecord.js
var App = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        TabCur: 0,
        showLoad: 1,
        index: null,
        colorList: ['olive', 'blue', 'yellow', 'orange', 'green', 'mauve', 'purple'],
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.getBabyList()
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
                                url: 'addBaby',
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
     * 
     * 拉取宝宝 疫苗预约 or 体温测量 记录
     */
    getBabyRecord: function (num) {
        let _this = this
        var url = num === 0 ? 'Vaccine/babyGRAttList' : 'baby/babyGRTempList'
        var _data = App.encrypt(JSON.stringify({
            "baby_id": _this.data.baby_id
        }))
        App._post_form(url, {
            data: _data
        }, res => {
            // console.log(res)
            var resData = JSON.parse(App.decrypt(res.data))
            console.log(resData)
            if (num === 0) {
                for (var i = 0; i < resData.length; i++) {
                    console.log(i)
                    resData[i].dateTimeArr = resData[i].create_time.split(' ')
                    //删除秒数
                    resData[i].dateTimeArr[1] = resData[i].dateTimeArr[1].substring(0, resData[i].dateTimeArr[1].length - 3)
                }
                _this.setData({
                    appoGroList: resData
                })
                console.log(_this.data.appoGroList)
            } else if (num === 1) {
                console.log(_this.dateComparisonToNewArr(resData))
                _this.setData({
                    tempGroList: resData
                })
            }
        })
    },

    /**
     * 
     * 拉取宝宝 疫苗预约 or 体温测量 记录
     */
    getBabyRecord: function (num) {
        let _this = this
        var url = num === 0 ? 'Vaccine/babyGRAttList' : 'baby/babyGRTempList'
        var _data = App.encrypt(JSON.stringify({
            "baby_id": _this.data.baby_id
        }))
        App._post_form(url, {
            data: _data
        }, res => {
            // console.log(res)
            var resData = JSON.parse(App.decrypt(res.data))
            console.log(resData)
            if (num === 0) {
                for (var i = 0; i < resData.length; i++) {
                    console.log(i)
                    resData[i].dateTimeArr = resData[i].create_time.split(' ')
                    //删除秒数
                    resData[i].dateTimeArr[1] = resData[i].dateTimeArr[1].substring(0, resData[i].dateTimeArr[1].length - 3)
                }
                _this.setData({
                    appoGroList: resData.sort(function (a, b) {
                        return b['create_time'] < a['create_time'] ? -1 : 1
                    })
                })
                console.log(_this.data.appoGroList)
            } else if (num === 1) {
                // _this.dateComparisonToNewArr(resData)
                _this.setData({
                    tempGroList: _this.dateComparisonToNewArr(resData)
                })
                console.log(_this.data.tempGroList)
            }
        })
    },
    /**
     * 
     * 选择baby
     */
    chooseBaby: function (e) {
        this.setData({
            index: e.detail.value,
            baby_id: this.data.babyList[e.detail.value].id,
        })
        this.getBabyRecord(0)
        this.getBabyRecord(1)
    },
    /**
     * tab切换
     */
    tabSelect(e) {
        console.log(e)
        this.setData({
            TabCur: e.currentTarget.dataset.id,
            scrollLeft: (e.currentTarget.dataset.id - 1) * 60
        })
    },
    /**
     *  遍历数据，将相同日期的元素组成一个数组，并根据时间排序
     */
    dateComparisonToNewArr: function (arr) {
        var _arr = arr
        for (var d = 0; d < _arr.length; d++) {
            _arr[d].create_time = _arr[d].create_time.split(' ')
            _arr[d].ymd = _arr[d].create_time[0]
            _arr[d].hm = _arr[d].create_time[1].substring(0, _arr[d].create_time[1].length - 3)
        }
        // var newArr = {}
        // var dest = []
        // for (var i = 0; i < _arr.length; i++) {
        //     var ai = _arr[i]
        //     if (!newArr[ai.ymd]) {
        //         dest.push({
        //             ymd: ai.ymd,

        //             data: [ai]
        //         })
        //         newArr[ai.ymd] = ai
        //     } else {
        //         for (var j = 0; j < dest.length; j++) {
        //             var dj = dest[j]
        //             if (dj.ymd = ai.ymd) {
        //                 dj.data.push(ai)
        //                 break
        //             }
        //         }
        //     }
        // }

        var map = {},
            dest = [];
        for (var i = 0; i < _arr.length; i++) {
            var ai = _arr[i];
            if (!map[ai.ymd]) {
                dest.push({
                    ymd: ai.ymd,
                    data: [ai]
                });
                map[ai.ymd] = ai;
            } else {
                for (var j = 0; j < dest.length; j++) {
                    var dj = dest[j];
                    if (dj.ymd == ai.ymd) {
                        dj.data.push(ai);
                        break;
                    }
                }
            }
        }
        dest.sort(function (a, b) {
            return b['ymd'] < a['ymd'] ? -1 : 1
        })
        return dest
    },
    /** 
     * 时间戳转化为年 月 日 时 分 秒 
     * number: 传入时间戳 
     * format：返回格式，支持自定义，但参数必须与formateArr里保持一致 ，调用=>  formatTime(timestamp, 'Y-M-D h:m:s')
     */
    formatTime: function (number, format) {

        var formateArr = ['Y', 'M', 'D', 'h', 'm', 's'];
        var returnArr = [];

        var date = new Date(number * 1000);
        returnArr.push(date.getFullYear());
        returnArr.push(this.formatNumber(date.getMonth() + 1));
        returnArr.push(this.formatNumber(date.getDate()));

        returnArr.push(this.formatNumber(date.getHours()));
        returnArr.push(this.formatNumber(date.getMinutes()));
        returnArr.push(this.formatNumber(date.getSeconds()));

        for (var i in returnArr) {
            format = format.replace(formateArr[i], returnArr[i]);
        }
        return format;
    },

    //数据转化  
    formatNumber: function (n) {
        n = n.toString()
        return n[1] ? n : '0' + n
    }
})