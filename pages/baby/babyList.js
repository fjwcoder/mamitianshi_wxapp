// pages/baby/babyList.js
let App = getApp();


Page({

    /**
     * 页面的初始数据
     */
    data: {
        aa: null,
        showLoad: 1,
        babyList: null,
        colorList: [{
                title: '桃粉',
                name: 'pink',
                color: '#e03997'
            },

            {
                title: '海蓝',
                name: 'blue',
                color: '#0081ff'
            },
            {
                title: '橄榄',
                name: 'olive',
                color: '#8dc63f'
            },

            {
                title: '明黄',
                name: 'yellow',
                color: '#fbbd08'
            },
            {
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
                title: '木槿',
                name: 'mauve',
                color: '#9c26b0'
            },
            {
                title: '棕褐',
                name: 'brown',
                color: '#a5673f'
            },
            {
                title: '嫣红',
                name: 'red',
                color: '#e54d42'
            },
            {
                title: '玄灰',
                name: 'grey',
                color: '#8799a3'
            },
            {
                title: '草灰',
                name: 'gray',
                color: '#aaaaaa'
            },
            {
                title: '墨黑',
                name: 'black',
                color: '#333333'
            },
            {
                title: '雅白',
                name: 'white',
                color: '#ffffff'
            },
        ]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {

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
        this.getBabyList()
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
     * 获取宝宝列表
     */
    getBabyList: function() {
        let _this = this
        App._post_form("baby/getBabyList", {}, res => {
            console.log(res)
            var resData = JSON.parse(App.decrypt(res.data))
            console.log(resData)
            if (resData[0] == undefined) {
                console.log("if here")
                _this.setData({
                    babyList: null,
                    showLoad: false
                })
            } else {
                _this.setData({
                    babyList: resData,
                    showLoad: false
                })
            }

        })
    },
    /**
     * 编辑宝宝信息
     */
    editBaby: function(e) {
        console.log(e)
        wx.navigateTo({
            url: 'editBaby?id=' + e.target.dataset.id,
        });

    },
    /**
     * 接种
     */
    beginAppointment: function(e) {
        wx.navigateTo({
            url: '../appointment/beginAppointment?baby_id=' + e.currentTarget.dataset.id,
        });
    },
    /**
     * 删除宝宝
     */
    deleteBaby: function(e) {
        let _this = this
        wx.showModal({
            title: '确定操作',
            content: '您确定要删除此条数据吗',
            showCancel: true,
            cancelText: '取消',
            cancelColor: '#000000',
            confirmText: '确定',
            confirmColor: '#3CC51F',
            success: (result) => {
                if (result.confirm) {
                    var dataStr = {
                        baby_id: +e.target.dataset.id
                    }
                    dataStr = App.encrypt(JSON.stringify(dataStr))
                    App._post_form('baby/delBaby', {
                        data: dataStr
                    }, res => {
                        console.log(res)
                        if (res.code === 200) {
                            wx.showToast({
                                title: '删除成功',
                                icon: 'success',
                                duration: 1500,
                                mask: false,
                                success: (result) => {
                                    setTimeout(function() {
                                        _this.getBabyList()
                                    }, 1500);
                                },
                            });
                        }
                    })
                } else if (result.cancel) {
                    console.log('用户点击取消')
                }

            },
        });
    },
    /**
     * 修改默认
     */
    changeIsDefault: function(e) {
        let _this = this
        console.log(e)
        console.log(App.decrypt('rMMOI+LlKlSYFSFV+6vzlg=='))
        if (e.detail.value) {
            wx.showModal({
                title: '提示',
                content: '您确定要将此条宝宝信息设为默认吗',
                showCancel: true,
                cancelText: '取消',
                cancelColor: '#000000',
                confirmText: '确定',
                confirmColor: '#3CC51F',
                success: (result) => {
                    if (result.confirm) {
                        _this.setData({
                            showLoad: 1
                        })
                        var babyId = App.encrypt(JSON.stringify({
                            b_id: e.currentTarget.dataset.id
                        }))
                        console.log(babyId)
                        App._post_form('baby/babyDefault', {
                            data: babyId
                        }, res => {
                            if (res.code === 200) {
                                _this.getBabyList()
                            }
                        })
                    }
                },
            });
        }
    }
})