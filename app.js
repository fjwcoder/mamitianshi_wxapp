//app.js
var aes = require('utils/aes.min.js')
App({
    globalData: {
        user_id: 0,
        user_mobile: null,
        user_token: null,

    },
    aes_key: '_MAMI_tianshi_RT',
    aes_iv: 'mnbvcxzlkjhgfdae',
    year: null,
    month: null,
    day: null,
    access_token: null,
    siteInfo: require('siteinfo.js'),

    onLaunch: function(e) {
        this.getSystemInformation();
        this.setYMD();
        this.createAccessToken();
        this.setApiRoot()
        console.log(e)
    },
    // 加密
    encrypt: function(data) {
        //十六位十六进制数作为秘钥
        var aeskey = aes.CryptoJS.enc.Utf8.parse(this.aes_key);
        //十六位十六进制数作为秘钥偏移量
        var aesiv = aes.CryptoJS.enc.Utf8.parse(this.aes_iv);
        var srcs = aes.CryptoJS.enc.Utf8.parse(data);
        var encrypted = aes.CryptoJS.AES.encrypt(srcs, aeskey, {
            iv: aesiv,
            mode: aes.CryptoJS.mode.CBC,
            padding: aes.CryptoJS.pad.Pkcs7
        });
        //返回base64加密结果
        return encrypted.toString();
    },

    //解密
    decrypt: function decrypt(data) {
        //十六位十六进制数作为秘钥
        var aeskey = aes.CryptoJS.enc.Utf8.parse(this.aes_key);
        //十六位十六进制数作为秘钥偏移量
        var aesiv = aes.CryptoJS.enc.Utf8.parse(this.aes_iv);
        // data是base64编码数据
        var decrypt = aes.CryptoJS.AES.decrypt(data, aeskey, {
            iv: aesiv,
            mode: aes.CryptoJS.mode.CBC,
            padding: aes.CryptoJS.pad.Pkcs7
        });
        var decryptedStr = decrypt.toString(aes.CryptoJS.enc.Utf8);
        return decryptedStr.toString();
    },

    /**
     * 获取系统信息
     */
    getSystemInformation: function() {
        let _this = this
            // 获取系统状态栏信息
        wx.getSystemInfo({
            success: function(e) {
                _this.globalData.StatusBar = e.statusBarHeight;
                let custom = wx.getMenuButtonBoundingClientRect();
                // console.log(custom)
                _this.globalData.Custom = custom;
                _this.globalData.CustomBar = custom.bottom + custom.top - e.statusBarHeight;
                // console.log(this.globalData)
            }
        })
    },

    /**
     * 设置当前年月日
     */
    setYMD: function() {
        var date = new Date(Date.parse(new Date()));
        //获取年份  
        this.year = date.getFullYear();
        //获取月份  
        this.month = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
        //获取当日日期 
        this.day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    },
    /**
     * 创建access_token
     */
    createAccessToken: function() {
        var access_token = null;
        let api_key = 'l2V|gfZp{8`;jzR~6Y1_FWlzdf';
        const md5_Obj = require('./utils/hex_md5.js');
        this.access_token = md5_Obj.hexMD5('MamiTianshi' + this.year + this.month + this.day + api_key);
        // console.log(this.access_token)
    },
    /**
     * 设置api地址
     */
    setApiRoot: function() {
        // this.api_root = this.siteInfo.siteroot + 'index.php?s=/api/';
        this.api_root = this.siteInfo.siteroot + 'api.php/';
        this.upload_root = this.siteInfo.uploadroot + 'api.php/';
        this.path_root = this.siteInfo.uploadroot;
    },
    /**
     * post提交
     */
    _post_form: function(url, data, success, fail, complete) {
        wx.showNavigationBarLoading();
        let App = this;
        data.wxapp_id = App.siteInfo.uniacid;
        // console.log(data)
        data.user_token = App.getGlobalData('user_token'),
          console.log(App.access_token);
            wx.request({
                url: App.api_root + url,
                header: {
                    'content-type': 'application/x-www-form-urlencoded',
                    'accesstoken': App.access_token,
                },
                method: 'POST',
                data: data,
                success: function(res) {

                    if (res.statusCode !== 200 || typeof res.data !== 'object') {
                        App.showError('网络请求出错');
                        return false;
                    }
                    // if (res.data.code !== 200) {
                    //   App.showError(res.msg);
                    //   return false;
                    // }
                    if (res.data.code === -1) {
                        // 登录态失效, 重新登录
                        App.doLogin(function() {
                            App._post_form(url, data, success, fail);
                        });
                        return false;
                    } else if (res.data.code === 0) {
                        App.showError(res.data.msg, function() {
                            fail && fail(res);
                        });
                        return false;
                    }
                    success && success(res.data);
                },
                fail: function(res) {
                    // console.log(res);
                    App.showError(res.errMsg, function() {
                        fail && fail(res);
                    });
                },
                complete: function(res) {
                    wx.hideLoading();
                    wx.hideNavigationBarLoading();
                    complete && complete(res);
                }
            });
    },

    /**
     * 冰箱post提交
     */
    _post_form_ice: function(url, data, success, fail, complete) {
      // console.log(this.decrypt(data))
        wx.showNavigationBarLoading();
        let App = this;
        wx.request({
          url: this.siteInfo.vaccine_root + url,
            header: {
                'content-type': 'application/x-www-form-urlencoded',
                'accesstoken': App.access_token,
            },

            method: 'POST',
            data: data,
            success: function(res) {
                if (res.statusCode !== 200 || typeof res.data !== 'object') {
                    App.showError('网络请求出错');
                    return false;
                }
                if (res.data.code === 0) {
                    App.showError(res.data.msg, function() {
                        fail && fail(res);
                    });
                    return false;
                }
                success && success(res.data);
            },
            fail: function(res) {
                // console.log(res);
                App.showError(res.errMsg, function() {
                    fail && fail(res);
                });
            },
            complete: function(res) {
                wx.hideLoading();
                wx.hideNavigationBarLoading();
                complete && complete(res);
            }
        });
    },

    /**
     * get请求
     */
    _get: function(url, data, success, fail, complete, check_login) {
        wx.showNavigationBarLoading();
        let App = this;
        // 构造请求参数
        data = data || {};
        data['wxapp_id'] = 10001;

        // if (typeof check_login === 'undefined')
        //   check_login = true;

        // 构造get请求
        let request = function() {
            // data.token = wx.getStorageSync('token');
            data.user_token = App.getGlobalData('user_token'),
                wx.request({
                    url: App.api_root + url,
                    header: {
                        'content-type': 'application/json',
                        'access_token': App.access_token,
                    },
                    data: data,
                    success: function(res) {
                        // console.log(res);
                        if (res.statusCode !== 200 || typeof res.data !== 'object') {
                            App.showError('网络请求出错');
                            return false;
                        }
                        if (res.data.code !== 200) { // add by fjw in 19.3.22: 如果接口返回状态码错误，就提示一下
                            App.showError(res.data.msg);
                            // return false;
                        }
                        if (res.data.code === -1) {
                            // 登录态失效, 重新登录
                            wx.hideNavigationBarLoading();
                            App.doLogin();
                        } else if (res.data.code === 0) {
                            App.showError(res.data.msg);
                            return false;
                        } else {
                            success && success(res.data);
                        }
                    },
                    fail: function(res) {
                        // console.log(res);
                        App.showError(res.errMsg, function() {
                            fail && fail(res);
                        });
                    },
                    complete: function(res) {
                        wx.hideNavigationBarLoading();
                        complete && complete(res);
                    },
                });
        };
        // 判断是否需要验证登录
        check_login ? App.doLogin(request) : request();
    },
    /**
     * 执行用户登录
     */
    doLogin: function() {
        // 保存当前页面
        let pages = getCurrentPages();
        if (pages.length) {
            let currentPage = pages[pages.length - 1];
            "pages/login/login" != currentPage.route &&
                wx.setStorageSync("currentPage", currentPage);
        }
        // 跳转授权页面
        wx.navigateTo({
            url: "/pages/login/login"
        });
    },
    /**
     * 判断是否登录
     */
    isLogin: function() {
        if (wx.getStorageSync('user_token') === '' || wx.getStorageSync('user_token') === null) {
            return false;
        } else {
            return true;
        }
    },
    /**
     * 显示失败提示框
     */
    showError: function(msg, callback) {
        wx.showModal({
            title: '友情提示',
            content: msg,
            showCancel: false,
            success: function(res) {
                // callback && (setTimeout(function() {
                //   callback();
                // }, 1500));
                callback && callback();
            }
        });
    },
    /**
     * 返回一页
     */
    navigateBack: function() {
        wx.navigateBack({
            delta: 1
        })
    },
    /**
     * 获取 App.globalData数据
     */
    getGlobalData: function(param) {
        return wx.getStorageSync(param);
    },

})