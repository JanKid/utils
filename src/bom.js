/*
 * @author: Jankid
 * @email: gaojianlin.1989@gmail.com
 * @date: 2017//07/21
 */

/**
 * 获取浏览器类型的简单封装
 * @method getBrowser
 * @param 
 * @return brower
 */
export function getBrowser() {
    let brower = {}
    let ua = navigator.userAgent.toLowerCase()
    let s;
    (s = ua.match(/edge\/([\d.]+)/)) ? brower.edge = s[1]:
        (s = ua.match(/rv:([\d.]+)\) like gecko/)) ? brower.ie = s[1] :
        (s = ua.match(/msie ([\d.]+)/)) ? brower.ie = s[1]:
        (s = ua.match(/firefox\/([\d.]+)/)) ? brower.ff = s[1] :
        (s = ua.match(/chrome\/([\d.]+)/)) ? brower.ch = s[1] :
        (s = ua.match(/opera.([\d.]+)/)) ? brower.o = s[1] :
        (s = ua.match(/version\/([\d.]+).*safari/)) ? brower.sf = s[1] :
        (s = ua.match(/MicroMessenger/i)) ? brower.wx = s[1] : 0
    return brower
}

/*
*  判断浏览器是PC端还是手机端
* 
*/
export function isPcBrowser () {
    let p = navigator.platform
    let win = p.indexOf("Win") === 0 // pc端window系统
    let mac = p.indexOf("Mac") === 0 // pc端Mac系统
    let x11 = (p=="X11")||(p.indexOf('Linux') === 0) //pc端Linux或者unix系统

    return win || mac || x11
}
/*
*  判断浏览器是手机端还是PC端
* 
*/
export function isMobieBrowser () {
    let agent = navigator.userAgent
    let android = /android/i.test(agent)
    let iphone = /(iPhone|iPad|iPod|iOS)/i.test(agent)
    let weixin =/MicroMessenger/i.test(agent)

    return android|| iphone|| weixin
}

/**  Cookie 相关操作  */
/**
 * 获取对应cookie
 * @method getCookie
 * @param  sKey 
 * @return cookie
 */
export function getCookie(sKey) {
    if (!sKey) { return null }
    return decodeURIComponent(document.cookie.replace(new RegExp('(?:(?:^|.*;)\\s*' + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, '\\$&') + '\\s*\\=\\s*([^;]*).*$)|^.*$'), '$1')) || null
}

export function setCookie(sKey, sValue, vEnd, sPath, sDomain, bSecure) {
    if (!sKey || /^(?:expires|max\-age|path|domain|secure)$/i.test(sKey)) { return false }
    var sExpires = ''
    if (vEnd) {
        switch (vEnd.constructor) {
            case Number:
                sExpires = vEnd === Infinity ? '; expires=Fri, 31 Dec 9999 23:59:59 GMT' : '; max-age=' + vEnd
                break
            case String:
                sExpires = '; expires=' + vEnd
                break
            case Date:
                sExpires = '; expires=' + vEnd.toUTCString()
                break
        }
    }
    document.cookie = encodeURIComponent(sKey) + '=' + encodeURIComponent(sValue) + sExpires + (sDomain ? '; domain=' + sDomain : '') + (sPath ? '; path=' + sPath : '') + (bSecure ? '; secure' : '')
    return true
}

export function deleteCookie(sKey, sPath, sDomain) {
    if (!this.hasItem(sKey)) { return false }
    document.cookie = encodeURIComponent(sKey) + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT' + (sDomain ? '; domain=' + sDomain : '') + (sPath ? '; path=' + sPath : '')
    return true
}

export function hasCookie(sKey) {
    if (!sKey) { return false }
    return (new RegExp('(?:^|;\\s*)' + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, '\\$&') + '\\s*\\=')).test(document.cookie)
}

export function cookieKeys() {
    var aKeys = document.cookie.replace(/((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g, '').split(/\s*(?:\=[^;]*)?;\s*/)
    for (var nLen = aKeys.length, nIdx = 0; nIdx < nLen; nIdx++) { aKeys[nIdx] = decodeURIComponent(aKeys[nIdx]) }
    return aKeys
}


/**  localStorage 相关操作  */
export function setLocalItem(sKey, sValue) {
    let cache = typeof sValue === 'string' ? sValue : JSON.stringify(sValue)
    localStorage.setItem(sKey, cache)
}

export function getLocalItem(sKey) {
    if (!hasLocalItem(sKey)) return null
    let cache = localStorage.getItem(sKey)
    return JSON.parse(cache)
}

export function hasLocalItem(sKey) {
    if (!sKey) return false
    return localStorage.getItem(sKey) ? true : false
}

export function removeLocalItem(sKey) {
    if (!hasLocalItem(sKey)) return false
    localStorage.removeItem(sKey)
}

export function clearLocal() {
    localStorage.clear()
}

export function formatSize(bytes) {
    var bt = parseInt(bytes)
    var result
    if (bt === 0) {
        result = '0B'
    } else {
        let k = 1024
        let sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
        let i = Math.floor(Math.log(bt) / Math.log(k))
        result = (bt / Math.pow(k, i)).toFixed(2) + sizes[i]
    }
    return result
}
