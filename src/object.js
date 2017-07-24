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