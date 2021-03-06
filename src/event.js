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
    if (!(Array.isArray(el) || el.constructor === NodeList)) el = [el]
    if (document.addEventListener) {
        el.forEach((item) => {
            item.addEventListener(event, fn, capture)
        })
    } else {
        el.forEach((item) => {
            item.attachEvent(`on${event}`, fn)
        })
    }
}
/**
 * 删除元素事件的简单封装
 * @method removeEvent
 * @param { el ,event, fn }
 */
export function removeEvent(el, event, fn, capture = false) {
    if (!(Array.isArray(el) || el.constructor === NodeList)) el = [el]
    if (document.addEventListener) {
        el.forEach((item) => {
            item.removeEventListener(event, fn, capture)
        })
    } else {
        el.forEach((item) => {
            item.detachEvent(`on${event}`, fn)
        })
    }
}
/**
 * 添加元素一次事件的简单封装
 * @method onceEvent
 * @param { el ,event, fn, capture}
 */
export function onceEvent(el, event, fn, capture) {
    let listen = (e) => {
        fn.apply(el, arguments)
        removeEvent(el, event, listen, capture)
    }
    addEvent(el, event, listen, capture)
}
/**
 * 取消事件的简单封装
 * @method cancelEvent
 * @param { event}
 */
export function cancelEvent(event) {
    event = event || window.event
    if (e.preventDefault) e.preventDefault()
    if (e.returnValue) e.returnValue = false
    return false
}