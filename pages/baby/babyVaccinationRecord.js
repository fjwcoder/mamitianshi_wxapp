// pages/baby/babyVaccinationRecord.js
let App = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showLoad: 1,
    index: null, //选择宝宝索引
    card_no: null, //接种卡号
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
        console.log(resData)
      }
    })
  },
  /**
   * 选择baby
   */
  chooseBaby: function (e) {
    let _this = this
    _this.setData({
      index: e.detail.value,
      card_no: null,
    })

    if (_this.data.babyList[e.detail.value].card_no === '') { //资料中无接种卡号
      wx.showModal({
        title: '提示',
        content: '您选择的宝宝暂未填写接种卡号，本次需要您手动输入接种卡号',
        showCancel: false,
        confirmText: '确定',
        confirmColor: '#3CC51F',
        success: (result) => {
          if (result.confirm) {}
        },

      });
    } else {
      _this.setData({
        card_no: _this.data.babyList[e.detail.value].card_no
      })
    }
  },
  /**
   * 监听card_no输入框
   */
  onInputCardNo: function (e) {
    // console.log(e)
    this.setData({
      card_no: e.detail.value
    })
  },
  /**
   * 开始查询接种记录
   */
  beganToQuery: function () {
    console.log(this.data.card_no)
    let _this = this
    _this.setData({
      showLoad: 1
    })
    App._post_form_ice("cardGetInjectList", {
      card_no: _this.data.card_no
    }, function (res) {
      console.log(res)
      if (res.data.length === 0) {
        wx.showModal({
          title: '提示',
          content: '暂未查询到接种记录',
          showCancel: false,
          confirmText: '确定',
          confirmColor: '#3CC51F',
          success: (result) => {
            if (result.confirm) {

            }
          },
          fail: () => {},
          complete: () => {}
        });
      }
      _this.setData({
        injectList: _this.formatJson(res.data),
        showLoad: false
      })
      console.log(_this.data.injectList)
    })
  },

  /**
   * 遍历接种记录列表  json字符串转json
   */

  formatJson: function (d) {
    for (var i = 0; i < d.length; i++) {
      d[i].vaccine_list = JSON.parse(d[i].vaccine_list);
      d[i].c_time = d[i].create_time.substr(0, 10)
    }
    return d
  }
})