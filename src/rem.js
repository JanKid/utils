/**
 * 简单的移动rem实现
 * @method simpleRem
 */
const doc = document
const win = window
const resizeEvt = 'orientationchange' in window ?
    'orientationchange' :
    'resize';

export function simpleRem() {
    var htmlEl = document.querySelector('html') || doc.documentElement,
        rem = htmlEl.offsetWidth / 7.5 //设计稿为750像素
    htmlEl.style.fontSize = rem + 'px'
        // 使用后样式全部除以100
    win.addEventListener(resizeEvt, recalc, false);
    doc.addEventListener('DOMContentLoaded', recalc, false);
}

/**
 * 简单的移动rem实现
 * @method simpleRem
 */
export function otherRem() {
    var htmlEl = document.querySelector('html') || doc.documentElement,
        rem = htmlEl.getBoundingClientRect().width / 10 //假设设计稿为750像素，将屏幕宽度分成10份，1份1rem
    htmlEl.style.fontSize = rem + 'px'
        // 使用后样式全部除以37.5 (设计稿为750，所以是375像素，然后除以10得 37.5)

    win.addEventListener(resizeEvt, recalc, false);
    doc.addEventListener('DOMContentLoaded', recalc, false);
}

export function normalRem(fontSize = 16, doc = document, win = window) {
    var docEl = doc.documentElement,

        recalc = function() {
            var clientWidth = docEl.clientWidth;
            if (!clientWidth)
                return;
            docEl.style.fontSize = fontSize * (clientWidth / 320) + 'px'; // 设计稿为640
        };
    if (!doc.addEventListener)
        return;
    win.addEventListener(resizeEvt, recalc, false);
    doc.addEventListener('DOMContentLoaded', recalc, false);
    /**
     * 然后可以用scss函数
     * //默认字体大小16px,屏幕宽度375px（iphone6尺寸）
     * $font: 16;
     *  $screen: 375;
     *  @function px2rem($n) {
     *    @return #{$n/($screen*$font/320)}rem
     *  }
     */
}