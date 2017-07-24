/**
 * 帧动画对象的简单兼容处理
 * @method requestAnimFrame
 * @param {  }
 * @return requestAnimFrame
 */
export const requestAnimFrame = (function() {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        function(callback) {
            window.setTimeout(callback, 1000 / 60);
        }
})()