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
export function extend(target) {
    if (target == null) { throw new Error('target cannot be null') }
    let i = 0,
        len = arguments.length,
        key, src
    while (++i < len) {
        src = arguments[i]
        if (src != null) {
            for (key in src) {
                if (src.hasOwnProperty(key)) { target[key] = src[key] }
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
export function deepClone(o) {
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
export function isEqual(a, b) {
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
export function isObject(o) {
    return o !== 'null' && typeof o === 'object'
}

/**
 * 判断对象是否存在该属性
 * @param {*} obj
 * @param {*} key
 */
export function hasOwn(obj, key) {
    return _hasOwn.call(obj, key)
}