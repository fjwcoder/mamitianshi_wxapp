// pages/index/index.js
var App = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        showLoad: false, //初始化显示加载动态图
        for_index: 0,
        TabCur: 0,
        scrollLeft: 0,
        cardCur: 0,
        DotStyle: 1, //轮播限高
        ColorList: [{
                title: '森绿',
                name: 'green',
                color: '#39b54a'
            },
            {
                title: '桔橙',
                name: 'orange',
                color: '#f37b1d'
            },
            {
                title: '海蓝',
                name: 'blue',
                color: '#0081ff'
            }, {
                title: '明黄',
                name: 'yellow',
                color: '#fbbd08'
            },
            {
                title: '橄榄',
                name: 'olive',
                color: '#8dc63f'
            },


            {
                title: '天青',
                name: 'cyan',
                color: '#1cbbb4'
            },

            {
                title: '姹紫',
                name: 'purple',
                color: '#6739b6'
            },
            {
                title: '嫣红',
                name: 'red',
                color: '#e54d42'
            },
            {
                title: '木槿',
                name: 'mauve',
                color: '#9c26b0'
            },
            {
                title: '桃粉',
                name: 'pink',
                color: '#e03997'
            },
            {
                title: '棕褐',
                name: 'brown',
                color: '#a5673f'
            },

        ],
        swiperList: [{
            id: 0,
            type: 'image',
            url: '../../images/banner.png'
        }, {
            id: 1,
            type: 'image',
            url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big84001.jpg',
        }, {
            id: 2,
            type: 'image',
            url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big39000.jpg'
        }, {
            id: 3,
            type: 'image',
            url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big10001.jpg'
        }, {
            id: 4,
            type: 'image',
            url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big25011.jpg'
        }, {
            id: 5,
            type: 'image',
            url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big21016.jpg'
        }, {
            id: 6,
            type: 'image',
            url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big99008.jpg'
        }],
        defaultBaby: null, //默认的baby
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        // console.log(App.year + '-' + App.month + '-' + App.day);
       
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
        this.getUserDetail()

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
     * 判断用户登录
     */
    getUserDetail: function() {
        let _this = this;
        if (App.isLogin() === false) { // 如果用户没有登录，就重新登录
            wx.hideNavigationBarLoading();
            App.doLogin();
            return false;
        }
        // _this.getBabyList()
        _this.getIndexBabyInfo()

        // App._get('User/getUserDetail', {}, function (result) {
        //   this.setData(result.data);
        // });
    },


    // /**
    //  * 获取宝宝列表
    //  */
    // getBabyList: function () {
    //   let _this = this
    //   App._post_form("baby/getBabyList", {}, res => {
    //     var resData = JSON.parse(App.decrypt(res.data))
    //     _this.setData({
    //       defaultBaby: _this.findTheDefault(resData)
    //     })
    //     console.log(_this.data.defaultBaby)
    //   })
    // },
    /**
     * 获取宝宝列表
     */
    getIndexBabyInfo: function() {
        let _this = this
        App._post_form("baby/indexBabyInfo", {}, result => {
            var resultData = JSON.parse(App.decrypt(result.data))
            resultData.sort(function(a, b) {
                return b['next_inject_date'] < a['next_inject_date'] ? 1 : -1
            })
            console.log(resultData)
            _this.setData({
                babyVacInfo: resultData
            })
            console.log(_this.data.babyVacInfo)
        })
    },
    // getIndexBabyInfo: function () {
    //   let _this = this
    //   App._post_form("baby/indexBabyInfo", {}, result => {
    //     var resultData = JSON.parse(App.decrypt(result.data))
    //     // var resData = App.decrypt(res.data)
    //     console.log(resultData)
    //     // _this.qwer(resData)
    //     // console.log("qwer ...")
    //     _this.setData({
    //       defaultBaby: resultData.baby_info,
    //       defaultBabyId:resultData.baby_info.id,
    //     })
    //     var indexAndDate = _this.findVacDate(resultData.remind_days)
    //     var _week = resultData.vaccine_days[indexAndDate.index]

    //     App._post_form("vaccine/getWeekVaccineInfo", {
    //       week: _week
    //     }, res => {
    //       console.log(res)
    //       _this.setData({
    //         injList: res.data,
    //         injDate: indexAndDate.date,
    //         showLoad: false
    //       })
    //     })
    //   })
    // },

    /**
     * 跳转预约页面
     */
    jumpAppointment: function(e) {
        console.log(e)
            // return
        wx.navigateTo({
            url: '../appointment/beginAppointment?baby_id=' + e.currentTarget.dataset.id,
        });
    },
    /**
     * 遍历接种日期取出大于等于今天的下标
     */
    findVacDate: function(data) {
        var today = App.year + '-' + App.month + '-' + App.day
        var indexAndDate = {}
        for (var i = 0; i <= data.length; i++) {
            if (data[i] >= today) {
                indexAndDate.index = i
                indexAndDate.date = data[i]
                return indexAndDate
            }
        }
    },
  launchAppError(e) {
    console.log(e.detail.errMsg)
  }



})