/**
 * 简单的移动rem实现
 * @method simpleRem
 */
export function simpleRem() {
    var htmlEl = document.querySelector('html'),
        rem = htmlEl.offsetWidth / 7.5 //设计稿为750像素
    htmlEl.style.fontSize = rem + 'px'
        // 使用后样式全部除以100
}

export function normalRem(fontSize = 16, doc = document, win = window) {
    var docEl = doc.documentElement,
        resizeEvt = 'orientationchange' in window ?
        'orientationchange' :
        'resize',
        recalc = function() {
            var clientWidth = docEl.clientWidth;
            if (!clientWidth)
                return;
            docEl.style.fontSize = fontSize * (clientWidth / 320) + 'px'; // 设计稿为750
        };
    if (!doc.addEventListener)
        return;
    win.addEventListener(resizeEvt, recalc, false);
    doc.addEventListener('DOMContentLoaded', recalc, false);
}
/**
 * 然后可以用scss函数
 * //默认字体大小16px,屏幕宽度375px（iphone6尺寸）
 * $font: 16;
 *  $screen: 375;
 *  @function px2rem($n) {
 *    @return #{$n/($screen*$font/320)}rem
 *  }
 */