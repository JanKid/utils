/**
 * 格式化日期
 * @method formatDate
 * @param { day,fmt }
 * @return string
 */
export function formatDate(day, fmt = 'yyyy/MM/dd') {
    let o = {
        'M+': day.getMonth() + 1, // 月份
        'd+': day.getDate(), // 日
        'H+': day.getHours(), // 小时
        'm+': day.getMinutes(), // 分
        's+': day.getSeconds(), // 秒
        'q+': Math.floor((day.getMonth() + 3) / 3), // 季度
        'S': day.getMilliseconds() // 毫秒
    }
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (day.getFullYear() + '').substr(4 - RegExp.$1.length))
    for (let k in o) {
        if (new RegExp('(' + k + ')').test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
    }
    return fmt
}

/**
 * 计算两个日期之间的日期
 * @method calcDate
 * @param { beginDate,endDate }
 * @return [date,date]
 */
export function calcDate(beginDate, endDate) {
    var begin = beginDate instanceof Date ? beginDate : new Date(beginDate),
        end = endDate instanceof Date ? endDate : new Date(endDate),
        day = begin.getDate(),
        dates = [],
        newBegin = 0;
    while (begin < end) {
        newBegin = begin.setDate(day)
        var newDate = new Date(newBegin)
        dates.push(newDate.formatDate('yyyy/MM/dd'))
        day = begin.getDate()
        day++
    }
    return dates
}