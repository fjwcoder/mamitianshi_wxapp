// pages/find/index.js
let App = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        StatusBar: App.globalData.StatusBar,
        CustomBar: App.globalData.CustomBar,
        siteroot: App.siteInfo.siteroot
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        console.log(App.siteInfo.siteroot)

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
        this.getArticleList()
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
    getArticleList: function() {
        let _this = this
        App._post_form('Article/getArticlesList', {}, res => {
                console.log(res)
                _this.setData({
                    articleList: res.data
                })
            })
            // wx.request({
            //   url: 'http://192.168.0.27:3000/article',
            //   data: {
            //     // 'articleId':1,
            //     // "test":"测试"
            //   },
            //   header: {
            //     'content-type': 'application/json'
            //   },
            //   method: 'POST',
            //   dataType: 'json',
            //   responseType: 'text',
            //   success: (result) => {
            //     console.log(result)
            //     this.setData({
            //       articleList: result.data
            //     })
            //   },
            //   fail: () => {},
            //   complete: () => {}
            // });

    },
    jumpArticleInfo: function(e) {
        console.log(e)
        wx.navigateTo({
            url: 'articleInfo?id=' + e.currentTarget.dataset.id,
        });

    },
    developing: function() {
        wx.showToast({
            title: '该功能正在开发中...',
            icon: 'none',
            image: '',
            duration: 1500,
        });
    }

})