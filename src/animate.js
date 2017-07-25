/*
 * @author: Jankid
 * @email: gaojianlin.1989@gmail.com
 * @date: 201//07/23
 */

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



/**
 * 动画序列播放
 * 来源 ：十年踪迹大神 https://www.h5jun.com/post/sixty-lines-of-code-animation.html
 */

function nowtime() {
    if (typeof performance !== 'undefined' && performance.now) {
        return performance.now();
    }
    return Date.now ? Date.now() : (new Date()).getTime();
}
// 对 requestAnimationFrame 进行 polyfill：
// if (typeof global.requestAnimationFrame === 'undefined') {
//     global.requestAnimationFrame = function(callback) {
//         return setTimeout(function() { //polyfill
//             callback.call(this, nowtime());
//         }, 1000 / 60);
//     }
//     global.cancelAnimationFrame = function(qId) {
//         return clearTimeout(qId);
//     }
// }

// animator 具体实现
export function Animator(duration, update, easing) {
    this.duration = duration;
    this.update = update;
    this.easing = easing;
}

Animator.prototype = {

    animate: function() {
        var startTime = 0,
            duration = this.duration,
            update = this.update,
            easing = this.easing,
            self = this;

        return new Promise(function(resolve, reject) {
            var qId = 0;

            function step(timestamp) {
                startTime = startTime || timestamp;
                var p = Math.min(1.0, (timestamp - startTime) / duration);

                update.call(self, easing ? easing(p) : p, p);

                if (p < 1.0) {
                    qId = requestAnimationFrame(step);
                } else {
                    resolve(self);
                }
            }

            self.cancel = function() {
                cancelAnimationFrame(qId);
                update.call(self, 0, 0);
                reject('User canceled!');
            }

            qId = requestAnimationFrame(step);
        });
    },
    ease: function(easing) {
        return new Animator(this.duration, this.update, easing);
    }
};