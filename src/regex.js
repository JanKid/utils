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
export function isNatural(value) {
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
export function isChinese(value) {
    let reg = /^(([\u4E00-\u9FA5])+，?)+$/
    if (reg.test(value)) return true
    return false
}

/**
 * 判断是否个邮箱
 * @method isEmail
 * @param {Any} 判断对象
 * @return {Boolean} 真假值
 */
export function isEmail(value) {
    let reg = /^\w+@[a-zA-Z\-0-9_]+?\.[a-zA-Z]{2,}$/
    if (reg.test(value)) return true
    return false
}


/**
 * 判断是否为正确日期格式
 * @method isDate
 * @param {String :'2017-02-05,2017.02.05,2017/02/05'} 判断对象
 * @return {Boolean} 真假值
 */
export function isDate(value) {
    let reg = /\d{4}(-|\/|\.)\d{2}\1\d{2}/
    if (reg.test(value)) return true
    return false
}

/**
 * 判断是否手机
 * @method isMobile
 * @param {Any} 判断对象
 * @return {Boolean} 真假值
 */
export function isMobile(value) {
    let reg = /^(13|15|18)\d{9}$/
    if (reg.test(value)) return true
    return false
}

/**
 * 判断是否手机
 * @method isQQ
 * @param {Any} 判断对象
 * @return {Boolean} 真假值
 */
export function isQQ(value) {
    var reg = /^[1-9]\d{4,10}$/
    if (reg.test(value)) return true
    return false
}

/**
 * 判断是否为身份证号码
 * @method isIdentify
 * @param {Any} 判断对象
 * @return {Boolean} 真假值
 */
export function isIdentify(value) {
    var reg = /(^\d{15}$)|(^\d{17}([0-9]|X|x)$)/
    if (reg.test(value)) return true
    return false
}