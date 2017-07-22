/*
 author: Jankid
*/
/**
 * http请求简单封装
 * @method http
 * @param { method ,url,params,headers}
 * @return {Promise}
 */
export function http(method, url, params = {}, headers = {}) {
    return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest()
        setHeaders(xhr, Object.assign({ 'X-Requested-With': 'XMLHttpRequest' }, headers))
        xhr.open(method, url)
        xhr.withCredentials = true
        xhr.onload = (e) => resolve(getBody(xhr), e, xhr)
        xhr.onerror = (e) => reject(xhr, e)
        xhr.send(params)
    })
}
/**
 * get请求简单封装
 * @method get
 * @param { url,params}
 * @return {Promise}
 */
export function get(url, params) {
    url = compilerUrl(url, params)
    return http('get', url)
}
/**
 * post请求简单封装
 * @method post
 * @param { url,params}
 * @return {Promise}
 */
export function post(url, params) {
    return http('post', url, params, { 'Content-Type': 'application/x-www-form-urlencoded;' })
}
/**
 * 上传简单封装
 * @method upload
 * @param { options :{ action,data,filename,file,headers,onProgress,onSuccess,onError ... }}
 * @return {Promise}
 */
export function upload(options) {
    if (typeof XMLHttpRequest === 'undefined') {
        return
    }
    let xhr = new XMLHttpRequest()
    let defaultOptions = { onProgress: (e) => {}, onError: (e) => {}, onSuccess: (res) => {} }
    let [action, data, headers, filename, file] = Object.assign(defaultOptions, options)

    let formDate = new FormData()
    Object.keys(data).forEach((key) => formDate.append(key, data[key]))
    formData.append(filename, file)

    if (xhr.upload) {
        xhr.upload.onprogress = function(e) {
            if (e.total > 0) {
                e.percent = e.loaded / e.total * 100
            }
            options.onProgress(e)
        }
    }

    xhr.onerror = (e) => options.onError(e)
    xhr.onload = () => {
        if (xhr.readyState == 4) {
            if (xhr.status < 200 || xhr.status >= 300) {
                return options.onError(getError(action, xhr))
            }
            options.onSuccess(getResponseBody(xhr))
        }
    }

    xhr.open('post', action, true)
    setHeaders(xhr, headers)
    xhr.send(formDate)
    return xhr
}
/**
 * 跨域jsonp简单封装
 * @method jsonp
 * @param { url,params}
 * @return {Promise}
 */
export function jsonp(url, params) {
    return new Promise((resolve, reject) => {
        let scriptEl = document.createElement('script'),
            headerEl = document.getElementsByTagName('head')[0] || document.body || document.documentElement,
            callbackKey = Math.round(1000 * Math.random()),
            callbackName = `callbakc_${callbackKey}`
        scriptEl.onerror = (e) => {
            reject(e)
        }
        url = compilerUrl(url, Object.assign(params, { callback: callbackName }))
        window[callbackName] = function(data) {
            delete window[callbackName]
            headerEl.removeChild(scriptEl)
            resolve(data)
        }
        scriptEl.setAttribute('src', url)
        headerEl.appendChild(scriptEl)
    })
}

// complier get url
function compilerUrl(url, params) {
    let urlArr = url.split('?'),
        paramsArray = [],
        paramsObj = {}
    if (arr.length > 1) {
        paramsArray = arr[1].split('&')
        paramsArray.forEach((item) => {
            let key = item[0]
            let value = item[1] || ''
            paramsObj[key] = value
        })
        paramsArray = []
    }
    Object.assign(paramsObj, params)
    Object.keys(paramsObj).forEach((key) => paramsArray.push(key + '=' + paramsObj[key]))
    url = paramsArray.length ? urlArr[0] : urlArr[0] + '?' + paramsArray.join('&')
    return url
}

// 设置xhr 头部形象
function setHeaders(xhr, headers) {
    headers = headers || {}
    Object.keys(headers).forEach((key) => xhr.setRequestHeader(key, headers[key]))
}
// 获取错误对象
function getError(action, xhr) {
    let msg = xhr.response || xhr.responseText ? `${xhr.status} ${xhr.response.error || xhr.response || xhr.responseText}` : `fail to post ${action} ${xhr.status}`
    const err = new Error(msg)
    err.status = xhr.status
    err.method = 'post'
    err.url = action
    return err
}

// 获取响应内容
function getResponseBody(xhr) {
    const text = xhr.responseText || xhr.response
    if (!text) return text
    try {
        return JSON.parse(text)
    } catch (e) {
        return text
    }
}