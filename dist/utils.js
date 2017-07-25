(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.utils = factory());
}(this, (function () { 'use strict';

/*
 author: Jankid
 email: gaojianlin.1989@gmail.com
 date: 2017//07/21
*/
/**
 * http请求简单封装
 * @method http
 * @param { method ,url,params,headers}
 * @return {Promise}
 */
function http(method, url, params = {}, headers = {}) {
    return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        xhr.open(method, url);
        setHeaders(xhr, Object.assign({ 'X-Requested-With': 'XMLHttpRequest' }, headers));
        xhr.withCredentials = true;
        xhr.onload = (e) => resolve(getResponseBody(xhr), e, xhr);
        xhr.onerror = (e) => reject(xhr, e);
        xhr.send(params);
    })
}
/**
 * get请求简单封装
 * @method get
 * @param { url,params}
 * @return {Promise}
 */
function get(url, params) {
    url = compilerUrl(url, params);
    return http('get', url)
}
/**
 * post请求简单封装
 * @method post
 * @param { url,params}
 * @return {Promise}
 */
function post(url, params) {
    return http('post', url, params, { 'Content-Type': 'application/x-www-form-urlencoded;' })
}
/**
 * 上传简单封装
 * @method upload
 * @param { options :{ action,data,filename,file,headers,onProgress,onSuccess,onError ... }}
 * @return {Promise}
 */
function upload(options = {}) {
    if (typeof XMLHttpRequest === 'undefined') {
        return
    }
    let xhr = new XMLHttpRequest();
    let defaultOptions = { data: {}, filename: 'filename', onProgress: (e) => {}, onError: (e) => {}, onSuccess: (res) => {} };
    let { action, data, headers, filename, file } = Object.assign(defaultOptions, options);
    let formData = new FormData();

    Object.keys(data).forEach((key) => formData.append(key, data[key]));
    formData.append(filename, file);

    if (xhr.upload) {
        xhr.upload.onprogress = function(e) {
            if (e.total > 0) {
                e.percent = e.loaded / e.total * 100;
            }
            options.onProgress(e);
        };
    }

    xhr.onerror = (e) => options.onError(e);
    xhr.onload = () => {
        if (xhr.readyState == 4) {
            if (xhr.status < 200 || xhr.status >= 300) {
                return options.onError(getError(action, xhr))
            }
            options.onSuccess(getResponseBody(xhr));
        }
    };

    xhr.open('post', action, true);
    setHeaders(xhr, headers);
    xhr.send(formData);
    return xhr
}
/**
 * 跨域jsonp简单封装
 * @method jsonp
 * @param { url,params}
 * @return {Promise}
 */
function jsonp(url, params) {
    return new Promise((resolve, reject) => {
        let scriptEl = document.createElement('script'),
            headerEl = document.getElementsByTagName('head')[0] || document.body || document.documentElement,
            callbackKey = Math.round(1000 * Math.random()),
            callbackName = `callbakc_${callbackKey}`;
        scriptEl.onerror = (e) => {
            reject(e);
        };
        url = compilerUrl(url, Object.assign(params, { callback: callbackName }));
        window[callbackName] = function(data) {
            delete window[callbackName];
            headerEl.removeChild(scriptEl);
            resolve(data);
        };
        scriptEl.setAttribute('src', url);
        headerEl.appendChild(scriptEl);
    })
}

// complier get url
function compilerUrl(url, params = {}) {
    let urlArr = url.split('?'),
        paramsArray = [],
        paramsObj = {};
    if (urlArr.length > 1) {
        paramsArray = urlArr[1].split('&');
        paramsArray.forEach((item) => {
            let key = item[0];
            let value = decodeURIComponent(item[1]) || '';
            paramsObj[key] = value;
        });
        paramsArray = [];
    }
    Object.assign(paramsObj, params);
    Object.keys(paramsObj).forEach((key) => paramsArray.push(key + '=' + paramsObj[key]));
    url = paramsArray.length ? urlArr[0] + '?' + paramsArray.join('&') : urlArr[0];
    return url
}

// 设置xhr 头部信息
function setHeaders(xhr, headers) {
    headers = headers || {};
    Object.keys(headers).forEach((key) => xhr.setRequestHeader(key, headers[key]));
}
// 获取错误对象
function getError(action, xhr) {
    let msg = xhr.response || xhr.responseText ? `${xhr.status} ${xhr.response.error || xhr.response || xhr.responseText}` : `fail to post ${action} ${xhr.status}`;
    const err = new Error(msg);
    err.status = xhr.status;
    err.method = 'post';
    err.url = action;
    return err
}

// 获取响应内容
function getResponseBody(xhr) {
    const text = xhr.responseText || xhr.response;
    if (!text) return text
    try {
        return JSON.parse(text)
    } catch (e) {
        return text
    }
}

var ajax = Object.freeze({
	http: http,
	get: get,
	post: post,
	upload: upload,
	jsonp: jsonp
});

/*
 * @author: Jankid
 * @email: gaojianlin.1989@gmail.com
 * @date: 201//07/23
 */

/**
 * 帧动画对象的简单兼容处理
 * @method requestAnimFrame
 * @param {  }
 * @return requestAnimFrame
 */
const requestAnimFrame = (function() {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        function(callback) {
            window.setTimeout(callback, 1000 / 60);
        }
})();



// 对 requestAnimationFrame 进行 polyfill：
// if (typeof global.requestAnimationFrame === 'undefined') {
//     global.requestAnimationFrame = function(callback) {
//         return setTimeout(function() { //polyfill
//             callback.call(this, nowtime());
//         }, 1000 / 60);
//     }
//     global.cancelAnimationFrame = function(qId) {
//         return clearTimeout(qId);
//     }
// }

// animator 具体实现
function Animator(duration, update, easing) {
    this.duration = duration;
    this.update = update;
    this.easing = easing;
}

Animator.prototype = {

    animate: function() {
        var startTime = 0,
            duration = this.duration,
            update = this.update,
            easing = this.easing,
            self = this;

        return new Promise(function(resolve, reject) {
            var qId = 0;

            function step(timestamp) {
                startTime = startTime || timestamp;
                var p = Math.min(1.0, (timestamp - startTime) / duration);

                update.call(self, easing ? easing(p) : p, p);

                if (p < 1.0) {
                    qId = requestAnimationFrame(step);
                } else {
                    resolve(self);
                }
            }

            self.cancel = function() {
                cancelAnimationFrame(qId);
                update.call(self, 0, 0);
                reject('User canceled!');
            };

            qId = requestAnimationFrame(step);
        });
    },
    ease: function(easing) {
        return new Animator(this.duration, this.update, easing);
    }
};

var animate = Object.freeze({
	requestAnimFrame: requestAnimFrame,
	Animator: Animator
});

/*
 * author: Jankid
 * email: gaojianlin.1989@gmail.com
 * date: 2017//07/21
 */

/**
 * 添加元素事件的简单封装
 * @method addEvent
 * @param { el ,event, fn, capture}
 */
function addEvent(el, event, fn, capture = false) {
    if (!(Array.isArray(el) || el.constructor === NodeList)) el = [el];
    if (document.addEventListener) {
        el.forEach((item) => {
            item.addEventListener(event, fn, capture);
        });
    } else {
        el.forEach((item) => {
            item.attachEvent(`on${event}`, fn);
        });
    }
}
/**
 * 删除元素事件的简单封装
 * @method removeEvent
 * @param { el ,event, fn }
 */
function removeEvent(el, event, fn, capture = false) {
    if (!(Array.isArray(el) || el.constructor === NodeList)) el = [el];
    if (document.addEventListener) {
        el.forEach((item) => {
            item.removeEventListener(event, fn, capture);
        });
    } else {
        el.forEach((item) => {
            item.detachEvent(`on${event}`, fn);
        });
    }
}
/**
 * 添加元素一次事件的简单封装
 * @method onceEvent
 * @param { el ,event, fn, capture}
 */
function onceEvent(el, event, fn, capture) {
    let listen = (e) => {
        fn.apply(el, arguments);
        removeEvent(el, event, listen, capture);
    };
    addEvent(el, event, listen, capture);
}
/**
 * 取消事件的简单封装
 * @method cancelEvent
 * @param { event}
 */
function cancelEvent(event) {
    event = event || window.event;
    if (e.preventDefault) e.preventDefault();
    if (e.returnValue) e.returnValue = false;
    return false
}

var event = Object.freeze({
	addEvent: addEvent,
	removeEvent: removeEvent,
	onceEvent: onceEvent,
	cancelEvent: cancelEvent
});

/*
 * @author: Jankid
 * @email: gaojianlin.1989@gmail.com
 * @date: 2017//07/21
 */
const _hasOwn = Object.prototype.hasOwnProperty;
/**
 * 简单合并对象
 * @method extend
 * @param {target, ...otherTarget } 源对象伪数组
 * @return {Object} 新对象
 */
function extend(target) {
    if (target == null) { throw new Error('target cannot be null') }
    let i = 0,
        len = arguments.length,
        key, src;
    while (++i < len) {
        src = arguments[i];
        if (src != null) {
            for (key in src) {
                if (src.hasOwnProperty(key)) { target[key] = src[key]; }
            }
        }
    }
    return target
}

/**
 * 深拷贝对象
 * @method deepClone
 * @param {Object} 源对象
 * @return {Object} 新对象
 */
function deepClone(o) {
    if (typeof o != 'object') {
        throw new Error('parameter must be object')
    }
    return JSON.parse(JSON.stringify(o))
}

/**
 * 判断是否相等
 * @param {Object,Array} a 
 * @param {Object,Array} b 
 */
function isEqual(a, b) {
    return a == b || (
        isObject(a) && isObject(b) ?
        JSON.stringify(a) === JSON.stringify(b) :
        false
    )
}

/**
 * 判断是否是对象
 * @param {Object} o 
 */
function isObject(o) {
    return o !== 'null' && typeof o === 'object'
}

/**
 * 判断对象是否存在该属性
 * @param {*} obj
 * @param {*} key
 */
function hasOwn(obj, key) {
    return _hasOwn.call(obj, key)
}

var object = Object.freeze({
	extend: extend,
	deepClone: deepClone,
	isEqual: isEqual,
	isObject: isObject,
	hasOwn: hasOwn
});

/*
 * @author: Jankid
 * @email: gaojianlin.1989@gmail.com
 * @date: 2017//07/21
 */
/** 一些正则的简单判断，不只是最精确的，请谨慎使用  */
/**
 * 判断是否自然数
 * @method isNatural
 * @param {Any} 判断对象
 * @return {Boolean} 真假值
 */
function isNatural(value) {
    if (typeof value === 'number') {
        return Number.isInteger(value) && value
    } else if (typeof value === 'string') {
        return isNatural(Number(value))
    } else {
        return false
    }
}

/**
 * 判断是否个中文
 * @method isChinese
 * @param {Any} 判断对象
 * @return {Boolean} 真假值
 */
function isChinese(value) {
    let reg = /^(([\u4E00-\u9FA5])+，?)+$/;
    if (reg.test(value)) return true
    return false
}

/**
 * 判断是否个邮箱
 * @method isEmail
 * @param {Any} 判断对象
 * @return {Boolean} 真假值
 */
function isEmail(value) {
    let reg = /^\w+@[a-zA-Z\-0-9_]+?\.[a-zA-Z]{2,}$/;
    if (reg.test(value)) return true
    return false
}


/**
 * 判断是否为正确日期格式
 * @method isDate
 * @param {String :'2017-02-05,2017.02.05,2017/02/05'} 判断对象
 * @return {Boolean} 真假值
 */
function isDate(value) {
    let reg = /\d{4}(-|\/|\.)\d{2}\1\d{2}/;
    if (reg.test(value)) return true
    return false
}

/**
 * 判断是否手机
 * @method isMobile
 * @param {Any} 判断对象
 * @return {Boolean} 真假值
 */
function isMobile(value) {
    let reg = /^(13|15|18)\d{9}$/;
    if (reg.test(value)) return true
    return false
}

/**
 * 判断是否手机
 * @method isQQ
 * @param {Any} 判断对象
 * @return {Boolean} 真假值
 */
function isQQ(value) {
    var reg = /^[1-9]\d{4,10}$/;
    if (reg.test(value)) return true
    return false
}

/**
 * 判断是否为身份证号码
 * @method isIdentify
 * @param {Any} 判断对象
 * @return {Boolean} 真假值
 */
function isIdentify(value) {
    var reg = /(^\d{15}$)|(^\d{17}([0-9]|X|x)$)/;
    if (reg.test(value)) return true
    return false
}

var regex = Object.freeze({
	isNatural: isNatural,
	isChinese: isChinese,
	isEmail: isEmail,
	isDate: isDate,
	isMobile: isMobile,
	isQQ: isQQ,
	isIdentify: isIdentify
});

/*
 * @author: Jankid
 * @email: gaojianlin.1989@gmail.com
 * @date: 2017//07/21
 */

/**
 * 格式化日期
 * @method formatDate
 * @param { day,fmt }
 * @return string
 */
function formatDate(day, fmt = 'yyyy/MM/dd') {
    let o = {
        'M+': day.getMonth() + 1, // 月份
        'd+': day.getDate(), // 日
        'H+': day.getHours(), // 小时
        'm+': day.getMinutes(), // 分
        's+': day.getSeconds(), // 秒
        'q+': Math.floor((day.getMonth() + 3) / 3), // 季度
        'S': day.getMilliseconds() // 毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (day.getFullYear() + '').substr(4 - RegExp.$1.length));
    for (let k in o) {
        if (new RegExp('(' + k + ')').test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)));
    }
    return fmt
}

/**
 * 计算两个日期之间的日期
 * @method calcDate
 * @param { beginDate,endDate }
 * @return [date,date]
 */
function calcDate(beginDate, endDate) {
    var begin = beginDate instanceof Date ? beginDate : new Date(beginDate),
        end = endDate instanceof Date ? endDate : new Date(endDate),
        day = begin.getDate(),
        dates = [],
        newBegin = 0;
    while (begin < end) {
        newBegin = begin.setDate(day);
        var newDate = new Date(newBegin);
        dates.push(newDate);
        day = begin.getDate();
        day++;
    }
    return dates
}

/**
 * 计算当前日期的当月的天数
 * @method getDays
 * @param { day : Date }
 * @return [ days :Number]
 */
function getDays(day) {
    let date = day instanceof Date ? day : new Date(day);
    date = new Date(date.valueOf());
    date.setDate(1);
    date.setMonth(date.getMonth() + 1);
    date.setDate(0);
    return date.getDate()
}

/**
 * 计算当前日期的当月的日视图
 * @method getDayView
 * @param { day : Date }
 * @return { Object }
 */
function getDayView(date) {
    let dayValue = date.valueOf();
    let totalDays = 42; // 日视图总数 7 x 6 
    let dayOne = (new Date(dayValue)); // 用于保存当前月的1号日期
    let lastDate = new Date(dayValue); // 保存上个月日期
    let lastDays = getDays(lastDate); // 上个月的总天数

    let days = getDays(date); // 当前月的总天数
    let nextDays = totalDays - days;

    let dayWeek = 1; //保存当前月1号的星期
    let dayView = []; // 当月日视图
    let prevMonth = []; // 保存上月日期
    let nextMonth = []; // 保存下月日期
    let curMonth = []; // 保存当月日期

    // 设置上月日期
    lastDate.setDate(0);
    lastDays = getDays(lastDate);
        // 设置当前日期为1号
    dayOne.setDate(1);
    dayWeek = dayOne.getDay() || 7;
    nextDays -= dayWeek;
        // 计算上个月日期
    for (let i = dayWeek, j = lastDays; i > 0; i--, j--) {
        prevMonth.push(j);
        dayView.push(j);
    }
    prevMonth = prevMonth.reverse().map(day => new Date(lastDate.getFullYear(), lastDate.getMonth(), day));
    dayView.reverse();
        // 计算当前月日期
    for (let i = 1; i <= days; i++) {
        dayOne.setDate(i);
        dayView.push(i);
        curMonth.push(new Date(dayOne.valueOf()));
    }
    // 计算下个月日期
    dayOne.setDate(days + 1);
    for (let i = 1; i <= nextDays; i++) {
        dayOne.setDate(i);
        dayView.push(i);
        nextMonth.push(new Date(dayOne.valueOf()));
    }

    return {
        curDate: date,
        prevMonth,
        curMonth,
        nextMonth,
        dayView
    }
}

var date = Object.freeze({
	formatDate: formatDate,
	calcDate: calcDate,
	getDays: getDays,
	getDayView: getDayView
});

var index = {
    ajax,
    animate,
    event,
    object,
    regex,
    date
};

return index;

})));
//# sourceMappingURL=utils.js.map
