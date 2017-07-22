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
export function addEvent(el, event, fn, capture = false) {
    if (el.addEventListener) {
        if (el.length) {
            el.forEach((item) => {
                item.addEventListener(event, fn, capture)
            })
        } else {
            el.addEventListener(event, fn, capture)
        }
    } else {
        if (el.length) {
            el.forEach((item) => {
                item.attachEvent(`on${event}`, fn)
            })
        } else {
            el.attachEvent(`on${event}`, fn)
        }
    }
}
/**
 * 删除元素事件的简单封装
 * @method removeEvent
 * @param { el ,event, fn }
 */
export function removeEvent(el, event, fn) {
    if (el.addEventListener) {
        if (el.length) {
            el.forEach((item) => {
                item.removeEventListener(event, fn, capture)
            })
        } else {
            el.removeEventListener(event, fn, capture)
        }
    } else {
        if (el.length) {
            el.forEach((item) => {
                item.detachEvent(`on${event}`, fn)
            })
        } else {
            el.detachEvent(`on${event}`, fn)
        }
    }
}
/**
 * 添加元素一次事件的简单封装
 * @method addEvent
 * @param { el ,event, fn, capture}
 */
export function onceEvent(el, event, fn) {
    let listen = (e) => {
        fn.apply(el, arguments)
        removeEvent(el, event, listen)
    }
    addEvent(el, event, listen)
}