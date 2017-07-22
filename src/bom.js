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
    (s = ua.match(/msie ([\d.]+)/)) ? brower.ie = s[1]:
        (s = ua.match(/firefox\/([\d.]+)/)) ? brower.ff = s[1] :
        (s = ua.match(/chrome\/([\d.]+)/)) ? brower.ch = s[1] :
        (s = ua.match(/opera.([\d.]+)/)) ? brower.o = s[1] :
        (s = ua.match(/version\/([\d.]+).*safari/)) ? brower.sf = s[1] :
        (s = ua.match(/MicroMessenger/i)) ? brower.wx = s[1] : 0
    return brower
}