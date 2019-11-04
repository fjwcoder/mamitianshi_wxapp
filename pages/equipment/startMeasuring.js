var App = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        isLoad: null, //加载动画 null=加载
        deviceId: null,
        temMsg: '未连接',
        deviceName: "AET-WD",
        showLoad: null,
        index: null, //宝宝picker索引
        isLoad: false, //导航栏加载动画
        connectMsg: '链接', //按钮文字
        connectColor: 'green', //按钮颜色
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.getBabyList()
        var timestamp = parseInt(new Date().getTime() / 1000);
        var dd = 1570414220

        console.log(this.formatTime(timestamp, 'Y-M-D h:m:s'))
        console.log(dd)
        var qwerrr = 'DT813740000000'
        console.log(this.insertFlg(qwerrr.substr(4, 4), '.', 2))
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
        wx.showToast({
            title: '请先选择要测量体温的宝宝',
            icon: 'none',
            duration: 1500,
            mask: false,
        });
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
        wx.showModal({
            title: '提示',
            content: '当前暂未连接蓝牙奶嘴体温计',
            showCancel: true,
            cancelText: '取消',
            cancelColor: '#000000',
            confirmText: '连接',
            confirmColor: '#3CC51F',
            success: (result) => {
                if (result.confirm) {
                    this.startConnect()
                }
            },
        });

    },
    /**
     * 字符串指定位置插入符号
     */
    insertFlg: function (str, flg, sn) { // str 字符串,flg 需要插入的符号,sn 插入位置下标
        var newstr = "";
        for (var i = 0; i < str.length; i += sn) {
            var tmp = str.substring(i, i + sn);
            newstr += tmp + flg;
        }
        return newstr.substring(0, newstr.length - 1); //最后一位会多出一个插入的符号，删除后return
    },
    /*
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

    startConnect: function () {
        wx.showLoading({
            title: '连接中',
            mask: true,
        });
        this.setData({
            isLoad: 1
        })
        wx.openBluetoothAdapter({
            success: (result) => {
                console.log(result)
                setTimeout(() => {
                    this.startBluetoothDevicesDiscovery()
                }, 1000)
            },
            fail: (e) => {
                wx.showModal({
                    title: '提示',
                    content: '请开启手机蓝牙和定位服务后重新进入此页面',
                    showCancel: false,
                    confirmText: '确定',
                    confirmColor: '#3CC51F',
                    success: (result) => {
                        if (result.confirm) { //确定
                            wx.navigateBack({ //点击确定与取消都会执行
                                delta: 1
                            });
                        }
                    },
                });
            },
            complete: () => {
                wx.hideLoading();
            }
        });
    },
    connectOrClose: function () {
        if (this.data.connectColor === 'green') {
            console.log("green")
            this.startConnect()
        } else if (this.data.connectColor === 'grey') {
            console.log('grey')
            this.onCloseConnect()
        }
    },

    getConnect: function () {
        wx.showLoading({
            title: '连接中',
        })
        var that = this;
        var timer = setInterval(function () {
                wx.getBluetoothDevices({ //获取在蓝牙模块生效期间所有已发现的蓝牙设备。包括已经和本机处于连接状态的设备。
                    success: function (res) {
                        console.log("devices", res);
                        for (var i = 0; i < res.devices.length; i++) {
                            if (res.devices[i].name == that.data.deviceName) {
                                wx.showToast({
                                    title: '请打开手机的蓝牙与定位服务，否则可能会连接失败',
                                    icon: 'none',
                                    duration: 1500,
                                    mask: false,
                                    success: (result) => {
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
                                                        isConnected: true,
                                                        temMsg: '测量中',
                                                        connectMsg: '断开连接',
                                                        connectColor: 'grey',
                                                        isLoad: false
                                                    });
                                                    wx.stopBluetoothDevicesDiscovery(); //停止搜寻附近的蓝牙外围设备
                                                    that.onGetuuid()
                                                    wx.showToast({
                                                        title: '连接成功，请将奶嘴放入宝宝口中',
                                                        duration: 2000,
                                                    });
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
                                    },
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
    /**
     * 获取服务ID及特征值，并监听特征值改变
     */
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
                // wx.showLoading({
                //     title: '获取characteristicId',
                // })
                wx.getBLEDeviceCharacteristics({ //获取蓝牙设备某个服务中所有特征值(characteristic)。
                    deviceId: that.data.deviceId,
                    serviceId: serviceId,
                    success(getCharactersRes) {
                        console.log("getCharactersRes", getCharactersRes);
                        // wx.hideLoading();
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
                                    let characteristicValue = that.hexCharCodeToStr(that.ab2hex(onNotityChangeRes.value))
                                    console.log('监测到特征值改变', characteristicValue)
                                    var tem_msg = that.insertFlg(characteristicValue.substr(4, 4), '.', 2)
                                    that.setData({
                                        temMsg: tem_msg + '°C'
                                    })
                                    wx.showModal({
                                        title: '测量完成',
                                        content: '体温测量结果为：' + tem_msg + '°C',
                                        showCancel: false,
                                        success: res => {
                                            that.submitTemp(tem_msg)
                                        }
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
    /**
     * 提交测量结果到后台
     */
    submitTemp(tem) {
        let _this = this
        var _data = App.encrypt(JSON.stringify({
            'baby_id': _this.data.baby_id,
            'mtime': parseInt(new Date().getTime() / 1000),
            'temp': tem
        }))
        App._post_form('baby/setBabyTemp', {
            data: _data
        }, res => {
            console.log(res)
        })
    },
    onCloseConnect() {
        this.setData({
            isConnected: false,
            isFinded: false,
            connectMsg: '链接',
            connectColor: 'green',
            temMsg: '未连接',
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
    },
    hexCharCodeToStr: function (hexCharCodeStr) {
        var trimedStr = hexCharCodeStr.trim();
        var rawStr = trimedStr.substr(0, 2).toLowerCase() === "0x" ? trimedStr.substr(2) : trimedStr;
        var len = rawStr.length;
        if (len % 2 !== 0) {
            console.log("Illegal Format ASCII Code!");
            return "";
        }
        var curCharCode;
        var resultStr = [];
        for (var i = 0; i < len; i = i + 2) {
            curCharCode = parseInt(rawStr.substr(i, 2), 16); // ASCII Code Value

            resultStr.push(String.fromCharCode(curCharCode));
        }
        return resultStr.join("");
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