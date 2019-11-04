// pages/find/articleInfo.js
var App = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        colorList: ['olive', 'blue', 'yellow', 'orange', 'green', 'mauve', 'purple'],

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        console.log(options)
        this.getArticleInfo(parseInt(options.id))
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
    getArticleInfo: function(id) {
        App._post_form('Article/getArticlesInfo', { id: id }, res => {
                console.log(res)
                this.setData({
                    articleInfo: res.data
                })
            })
            // wx.request({
            //   url: 'http://192.168.0.27:3000/article/articleInfo',
            //   data: {
            //     'articleId': id
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
            //       articleInfo: result.data
            //     })
            //   },

        // });
    }
})