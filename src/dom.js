/*
 * author: Jankid
 * email: gaojianlin.1989@gmail.com
 * date: 2017//07/21
 */
/*
 * document 的一些操作简单封装
 */
export const dom = {
    $: function(selector) {
        return document.querySelectorAll(selector)
    },
    id: function(id) {
        return document.getElementById(id)
    },
    parent: function(el, parentClass) {
        if (!parentClass) return el.parentNode
        let parent = el.parentNode
        let parentCls = el.className
        console.log(parentCls)
        while (parentCls.indexOf(parentClass) < 0) {
            parent = parent.parentNode
            parentCls = parent.className || ''
            console.log(parent)
        }
        return parent
    },
    append: function(el, children) {
        if (!(Array.isArray(children) || children.constructor === NodeList)) children = [children]
        for (let i = 0; i < children.length; i++) {
            el.appendChild(children[i])
        }
        return el
    },
    prepend: function(el, children) {
        if (!(Array.isArray(children) || children.constructor === NodeList)) children = [children]
        for (let i = children.length - 1; i >= 0; i--) {
            if (el.firstChild) {
                el.insertBefore(children[i], parent.firstChild)
            } else {
                el.appendChild(children[i])
            }
        }
        return el
    },
    removeChildren: function(el) {
        while (el.hasChildNodes()) {
            el.removeChild(el.lastChild)
        }
        return el
    },
    addClass: function(el, className) {
        if (typeof className === 'undefined') return el
        var classes = className.split(' ')
        if (!(Array.isArray(el) || el.constructor === NodeList)) el = [el]
        for (var i = 0; i < classes.length; i++) {
            for (var j = 0; j < el.length; j++) {
                el[j].classList.add(classes[i]);
            }
        }
        return el
    },
    removeClass: function(el, className) {
        var classes = className.split(' ')
        if (!(Array.isArray(el) || el.constructor === NodeList)) el = [el]
        for (var i = 0; i < classes.length; i++) {
            for (var j = 0; j < el.length; j++) {
                el[j].classList.remove(classes[i])
            }
        }
        return el
    },
    hasClass: function(el, className) {
        if (!el.classList) {
            return el.className.match(new RegExp(`(\\s|^)(${className})(\\s|$)`), '$3')
        }
        return el.classList.contains(className)
    },
    offset: function(el) {
        if (!el) return null
        var box = el.getBoundingClientRect();
        var body = document.body;
        var clientTop = el.clientTop || body.clientTop || 0;
        var clientLeft = el.clientLeft || body.clientLeft || 0;
        var scrollTop = window.pageYOffset || el.scrollTop;
        var scrollLeft = window.pageXOffset || el.scrollLeft;
        return {
            top: box.top + scrollTop - clientTop,
            left: box.left + scrollLeft - clientLeft
        };
    },
    css: function(el, props, value) {
        var i;
        if (!(Array.isArray(el) || el.constructor === NodeList)) el = [el]
        if (arguments.length === 1) {
            if (typeof props === 'string') {
                if (el[0]) return window.getComputedStyle(el[0], null).getPropertyValue(props);
            } else {

                for (i = 0; i < el.length; i++) {
                    for (var prop in props) {
                        el[i].style[prop] = props[prop]
                    }
                }
                return el
            }
        }
        if (arguments.length === 2 && typeof props === 'string') {
            for (i = 0; i < el.length; i++) {
                el[i].style[props] = value
            }
            return el
        }
        return el
    },
    attr: function(el, attrs, value) {
        if (!(Array.isArray(el) || el.constructor === NodeList)) el = [el]
        if (arguments.length === 1 && typeof attrs === 'string') {
            // Get attr
            if (el[0]) return el[0].getAttribute(attrs);
            else return undefined;
        } else {
            // Set attrs
            for (var i = 0; i < el.length; i++) {
                if (arguments.length === 2) {
                    // String
                    el[i].setAttribute(attrs, value);
                } else {
                    // Object
                    Object.keys(attrs).forEach((attrName) => {
                        el[i][attrName] = attrs[attrName];
                        el[i].setAttribute(attrName, attrs[attrName]);
                    })
                }
            }
            return this;
        }
    },
    index: function(el) {
        if (el[0]) {
            var child = el[0];
            var i = 0;
            while ((child = child.previousSibling) !== null) {
                if (child.nodeType === 1) i++;
            }
            return i;
        } else return undefined;
    },
    // http://stackoverflow.com/a/35385518/1262580
    strConvetDom: function(htmlStr, children) {
        var template = document.createElement('template')
        template.innerHTML = htmlStr.trim()
        let node = template.content.firstChild
        if (children) {
            dom.append(node, children)
        }
        return node
    }
}