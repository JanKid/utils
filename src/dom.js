/*
 * author: Jankid
 * email: gaojianlin.1989@gmail.com
 * date: 2017//07/21
 */
/*
 * document 的一些操作简单封装
 */
export default {
    $: function(selector, dom) {
        dom = dom || document
        return dom.querySelectorAll(selector)
    },
    id: function(id) {
        return document.getElementById(id)
    },
    create(tag) {
        return document.createElement(tag)
    },
    parent: function(el, parentClass) {
        if (!parentClass) return el.parentNode
        let parent = el.parentNode
        let parentCls = el.className
        while (parentCls.indexOf(parentClass) < 0) {
            parent = parent.parentNode
            parentCls = parent.className || ''
            console.log(parent)
        }
        return parent
    },
    append: function(el, children) {
        if (!(Array.isArray(children) || children.constructor === NodeList)) children = [children]
        if (!(Array.isArray(el) || el.constructor === NodeList)) el = [el]
        for (let j = 0; j < el.length; j++) {
            for (let i = 0; i < children.length; i++) {
                let item = el[j]
                item.appendChild(children[i])
            }
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
    empty: function(el) {
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
        if (!el) return
        if (!(Array.isArray(el) || el.constructor === NodeList)) el = [el]
        if (arguments.length === 2 && typeof attrs === 'string') {
            // Get attr
            if (el[0]) return el[0].getAttribute(attrs);
            else return undefined;
        } else {
            // Set attrs
            for (var i = 0; i < el.length; i++) {
                if (arguments.length === 3) {
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
            var children = el[0];
            var i = 0;
            while ((children = children.previousSibling) !== null) {
                if (children.nodeType === 1) i++;
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
    },
    // 模版引擎，来源于某大神：https://icyfish.me/2017/07/11/implement-js-template-engine
    templateEngine: function(html, options) {
        var re = /<#([^#>]+)?#>/g, //  获取<# #> 里面的内容,原来是%号的，由于express渲染模版用到关键符号%，所以用#代替%
            reExp = /(^( )?(if|for|else|switch|case|break|{|}))(.*)?/g,
            code = 'var r=[];\n',
            cursor = 0,
            match;
        var add = function(line, js) {
            js ? (code += line.match(reExp) ? line + '\n' : 'r.push(' + line + ');\n') :
                (code += line != '' ? 'r.push("' + line.replace(/"/g, '\\"') + '");\n' : '');
            return add;
        }
        while (match = re.exec(html)) {
            add(html.slice(cursor, match.index))(match[1], true);
            cursor = match.index + match[0].length;
        }
        add(html.substr(cursor, html.length - cursor));
        code += 'return r.join("");';
        return new Function(code.replace(/[\r\t\n]/g, '')).apply(options);
    }
}