// pages/equipment/addEquipment.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        isLoad: null, //加载动画 null=加载
        deviceId: null,
        deviceName: "AET-WD",
        showLoad:null,
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
        wx.openBluetoothAdapter({
            success: (result) => {
                console.log(result)
                setTimeout(() => {
                    this.startBluetoothDevicesDiscovery()
                }, 1000)
            },
            fail: (e) => {
                wx.showModal({
                    title: '',
                    content: '请开启手机蓝牙后再试',
                    showCancel: true,
                    cancelText: '取消',
                    cancelColor: '#000000',
                    confirmText: '确定',
                    confirmColor: '#3CC51F',
                    success: (result) => {
                        wx.navigateBack({ //点击确定与取消都会执行
                            delta: 1
                        });
                        if (result.confirm) { //确定

                        }
                        console.log(result)
                    },
                    fail: () => {},
                    complete: () => {}
                });
            },
            complete: () => {}
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
     * 二进制数组转字符串
     */
    ab2str: function (buf) {
        return String.fromCharCode.apply(null, new Uint16Array(buf));
    },
    startBluetoothDevicesDiscovery: function () {
        var that = this;
        wx.startBluetoothDevicesDiscovery({ //开始搜寻附近的蓝牙外围设备
            success: function (res) {
                console.log("discovery", res);
                if (res.errCode == 0) {
                    that.getConnect();
                }
            },
        });
    },
    getConnect: function () {
        var that = this;
        var timer = setInterval(function () {
                wx.getBluetoothDevices({ //获取在蓝牙模块生效期间所有已发现的蓝牙设备。包括已经和本机处于连接状态的设备。
                    success: function (res) {
                        console.log("devices", res);
                        for (var i = 0; i < res.devices.length; i++) {
                            if (res.devices[i].name == that.data.deviceName) {
                                wx.showModal({
                                    title: '提示',
                                    content: '已找到蓝牙奶嘴体温计',
                                    showCancel: true,
                                    cancelText: '取消',
                                    cancelColor: '#000000',
                                    confirmText: '连接',
                                    confirmColor: '#3CC51F',
                                    success: (result) => {
                                        if(result.confirm){
                                            wx.showLoading({
                                                title: '连接中',
                                            })
                                            clearInterval(timer);
                                            that.setData({
                                                deviceId: res.devices[i].deviceId
                                            });
                                            console.log('设备号', that.data.deviceId);
                                            console.log("开始尝试建立连接");
                                            wx.createBLEConnection({ //连接低功耗蓝牙设备。
                                                deviceId: that.data.deviceId,
                                                timeout: 10000, //超时时间
                                                success: function (res) {
                                                    console.log(res);
                                                    if (res.errCode == 0) {
                                                        console.log('连接成功')
                                                        that.setData({
                                                            isConnected: true
                                                          });
                                                        wx.stopBluetoothDevicesDiscovery(); //停止搜寻附近的蓝牙外围设备
                                                        that.onGetuuid()
                                                    } else {
                                                        wx.showModal({
                                                            title: '提示',
                                                            content: '不能正常对蓝牙设备进行连接',
                                                            showCancel: false
                                                        })
                                                    }
                                                },
                                                fail: (res) => {
                                                    wx.hideLoading();
                                                    if (res.errCode == 10012) {
                                                        wx.showModal({
                                                            title: '提示',
                                                            content: '连接超时',
                                                            showCancel: false
                                                        })
                                                    }
                                                    console.warn("fail", res);
                                                },
                                                complete: () => {
                                                    wx.hideLoading();
                                                }
                                            })
                                        }
                                    },
                                    fail: ()=>{},
                                    complete: ()=>{}
                                });
                            
                                break;
                            }
                        }
                    }
                });
            },
            3000);
        setTimeout(function () {
            if (!that.data.isFinded && !that.data.isConnected) {
                clearInterval(timer);
                that.setData({
                    isFailed: false
                });
                wx.hideLoading();
                wx.showModal({
                    title: '提示',
                    content: '搜索蓝牙超时',
                    showCancel: false
                })
            }
        }, 12000);
    },
    sendCommand(i) {
        let _this = this;
        if (i < chunkCount) {
            let subCommand = subCommads[i]
            wx.writeBLECharacteristicValue({
                deviceId,
                serviceId,
                characteristicId,
                value: _this.str2ab(subCommand),
                success: function (res) {
                    setTimeout(function () {
                        send(i + 1)
                    }, 20)
                },
                fail: function (res) {
                    fail("fail", res)
                }
            })
        }
    },
    str2ab(str) {
        var buf = new ArrayBuffer(str.length);
        var bufView = new Uint8Array(buf);
        for (var i = 0, strLen = str.length; i < strLen; i++) {
            bufView[i] = str.charCodeAt(i)
        }
        return buf
    },
    ab2hex(buffer) {
        var hexArr = Array.prototype.map.call(new Uint8Array(buffer), function (bit) {
            return ('00' + bit.toString(16)).slice(-2)
        })
        return hexArr.join('');
    },
    onCommand(e) {
        this.setData({
            command: e.detail.value
        })
    },
    onSendCommand() {
        let that = this;
        if (that.data.serviceId && that.data.characteristicId) {
            wx.writeBLECharacteristicValue({
                deviceId: that.data.deviceId,
                serviceId: that.data.serviceId,
                characteristicId: that.data.characteristicId,
                value: that.str2ab(that.data.command),
                success: function (res) {
                    // setTimeout(function () {
                    //   send(i + 1)
                    // }, 20)
                    console.log("发送指令成功");
                    wx.showToast({
                        title: '发送成功',
                        icon: 'none'
                    })
                },
                fail: function (res) {
                    console.warn("发送指令失败", res)
                }
            })
        } else {
            wx.showModal({
                title: '提示',
                content: '请先获取设备信息',
                showCancel: false
            })
        }
    },
    onGetuuid() {
        let that = this;
            wx.showLoading({
                title: '获取serviceId',
            })
            console.log("开始获取设备信息");
            wx.getBLEDeviceServices({ //获取蓝牙设备所有服务(service)。
                deviceId: that.data.deviceId,
                success(getServicesRes) {
                    console.log("getServicesRes", getServicesRes);
                    let service = getServicesRes.services[1]
                    let serviceId = service.uuid
                    wx.showLoading({
                        title: '获取characteristicId',
                    })
                    wx.getBLEDeviceCharacteristics({ //获取蓝牙设备某个服务中所有特征值(characteristic)。
                        deviceId: that.data.deviceId,
                        serviceId: serviceId,
                        success(getCharactersRes) {
                            console.log("getCharactersRes", getCharactersRes);
                            wx.hideLoading();
                            let characteristic = getCharactersRes.characteristics[1]
                            let characteristicId = characteristic.uuid
                            that.setData({
                                serviceId: serviceId,
                                characteristicId: characteristicId
                            })
                            console.log('成功获取uuId', that.data.serviceId, that.data.characteristicId);
                            wx.notifyBLECharacteristicValueChange({ //启用低功耗蓝牙设备特征值变化时的 notify 功能，订阅特征值。
                                state: true, //注意：必须设备的特征值支持 notify 或者 indicate 才可以成功调用。
                                deviceId: that.data.deviceId,
                                serviceId: serviceId,
                                characteristicId: getCharactersRes.characteristics[1].uuid,
                                success() {
                                    console.log('开始监听特征值')
                                    wx.onBLECharacteristicValueChange(function (onNotityChangeRes) { //监听低功耗蓝牙设备的特征值变化事件。
                                        console.log('监听到特征值更新', onNotityChangeRes);
                                        let characteristicValue = that.ab2hex(onNotityChangeRes.value);
                                        console.log('最新值', characteristicValue)
                                        wx.showModal({
                                            title: '监听到特征值更新',
                                            content: `更新后的特征值(16进制格式):${characteristicValue}`,
                                            showCancel: false
                                        })
                                    })
                                },
                                fail: (res) => {
                                    console.warn("监听特征值失败");
                                }
                            })
                        },
                        fail: (res) => {
                            console.warn("获取特征值信息失败", res);
                        },
                        complete: (res) => {
                            console.log('获取服务信息完成');
                            wx.hideLoading();
                        }
                    })
                },
                fail: (res) => {
                    console.warn("获取服务信息失败", res);
                },
                complete: () => {
                    wx.hideLoading();
                }
            })
    },
    onCloseConnect() {
        this.setData({
            isConnected: false,
            isFinded: false
        })
        wx.closeBLEConnection({
            deviceId: this.data.deviceId,
            success: function (res) {
                console.log("成功断开连接");
                wx.showToast({
                    title: '成功断开连接',
                })
            },
        })
    }
})