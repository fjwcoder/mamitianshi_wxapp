// pages/appointment/appointmentList.js
const QRCode = require('../../utils/weapp-qrcode.js')
import rpx2px from '../../utils/rpx2px.js'
let qrcode;
const qrcodeWidth = rpx2px(300)
let App = getApp();


Page({

  /**
   * 页面的初始数据
   */
  data: {
    showLoad: 1,
    qrcodeWidth: qrcodeWidth, // 用于设置wxml里canvas的width和height样式
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    this.getAppointmentList()
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
   * 获取疫苗列表
   */
  getAppointmentList() {
    let _this = this
    App._post_form("vaccine/appointmentList", {}, res => {
      console.log(res)
      var resData = JSON.parse(App.decrypt(res.data))
      console.log(resData)
      _this.setData({
        appointmentList: resData,
        showLoad: false
      })
    })
  },
  /**
   * 取消预约
   */
  cancelAppointment: function (e) {
    let _this = this
    console.log(e)
    wx.showModal({
      title: '提示',
      content: '您确定要取消预约吗',
      showCancel: true,
      cancelText: '取消',
      cancelColor: '#000000',
      confirmText: '确定',
      confirmColor: '#3CC51F',
      success: (result) => {
        if (result.confirm) {
          var _data = App.encrypt(JSON.stringify({
            a_id: e.currentTarget.dataset.aid,
            o_id: e.currentTarget.dataset.oid
          }))
          App._post_form("vaccine/cancelAppointment", {
            data: _data
          }, res => {
            if (res.code === 200) {
              wx.showToast({
                title: '取消成功',
                icon: 'success',
                image: '',
                duration: 1500,
                mask: true,
              });
              _this.getAppointmentList();
            }
            console.log(res)
          })
        }
      },

    });


  },
  /**
   * 跳转添加预约页面
   */
  addAppointment: function () {
    wx.navigateTo({
      url: 'beginAppointment',
    });
  },
  /**
   * 显示预约二维码
   */
  showQrCode: function (e) {
    this.setData({
      showLoad:1
    })
    this.generateQR(e.currentTarget.dataset.qrurl)
    console.log(e)
  },
  /**
   * 跳转到预约详情
   */
  appointmentInfo: function (e) {
    console.log(e)
    wx.navigateTo({
      url: 'appointmentInfo?aid=' + e.currentTarget.dataset.aid + '&oid=' + e.currentTarget.dataset.oid,
    });
  },
  /**
   * 底部模态框隐藏
   */

  hideQrModal: function () {
    this.setData({
      show: false
    })
  },
  /**
   * 生成二维码
   */
  generateQR: function (text) {
    qrcode = new QRCode('canvas', {
      usingIn: this, // usingIn 如果放到组件里使用需要加这个参数
      // text: "https://github.com/tomfriwel/weapp-qrcode",
      // image: '/images/bg.jpg',
      width: qrcodeWidth,
      height: qrcodeWidth,
      colorDark: "#000000",
      colorLight: "white",
      correctLevel: QRCode.CorrectLevel.H,
    });

    // 生成图片，绘制完成后调用回调
    qrcode.makeCode(text, () => {
      this.setData({
        showLoad: false,
        show:1
      })
      // 回调
      // setTimeout(() => {
      //   qrcode.exportImage(function (path) {
      //     this.setData({
      //       imgsrc: path
      //     })
      //   })
      // }, 200)
    })
  }
})