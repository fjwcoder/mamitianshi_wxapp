// pages/appointment/appointmentInfo.js
const QRCode = require('../../utils/weapp-qrcode.js')
import rpx2px from '../../utils/rpx2px.js'
let qrcode;
const qrcodeWidth = rpx2px(300)
var App = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    qrcodeWidth: qrcodeWidth, // 用于设置wxml里canvas的width和height样式
    showLoad:1,//等待加载
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.getAppointmentInfo(parseInt(options.aid), options.oid)
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
   * 获取预约详情
   */
  getAppointmentInfo: function (aid, oid) {
    let _this = this
    var _data = App.encrypt(JSON.stringify({
      a_id: aid,
      o_id: oid
    }))
    console.log(App.decrypt(_data))
    App._post_form('vaccine/appointmentDetails', {
      data: _data
    }, result => {
      var resultData = JSON.parse(App.decrypt(result.data))
      _this.generateQR(resultData.qr_url)
      console.log(resultData)
      _this.setData({
        appointmentInfo: resultData
      })
      //拉取接种点详情
      App._post_form_ice("inpoinfo", {
        id: resultData.inject_position_id
      }, res => {
        console.log(res)
        _this.setData({
          inject_position_info: res.data,
          showLoad:false
        })
      })
    })
  },
  /**
   * 底部模态框显示/隐藏
   */
  showQrModal: function () {
    this.setData({
      show: 1
    })
  },
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