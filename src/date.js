/*
 * @author: Jankid
 * @email: gaojianlin.1989@gmail.com
 * @date: 2017//07/21
 */

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
        dates.push(newDate)
        day = begin.getDate()
        day++
    }
    return dates
}

/**
 * 计算当前日期的当月的天数
 * @method getDays
 * @param { day : Date }
 * @return [ days :Number]
 */
export function getDays(day) {
    let date = day instanceof Date ? day : new Date(day)
    date = new Date(date.valueOf())
    date.setDate(1)
    date.setMonth(date.getMonth() + 1)
    date.setDate(0)
    return date.getDate()
}

/**
 * 计算该年，这一个月的天数
 * @method getMonthDays
 * @param { year : Number,month:Number }
 * @return [ days :Number]
 */
export function getMonthDays(year, month) {
    var date = new Date(year, month)
    date.setDate(0)
    return date.getDate()
}

/**
 * 计算当前日期的上月1号
 * @method prevMonth
 * @param { day : Date }
 * @return [ day :Date]
 */
export function prevMonth(day) {
    let date = day instanceof Date ? day : new Date(day)
    date = new Date(date.valueOf())
    date.setDate(0)
    date.setDate(1)
    return date
}

/**
 * 比较两个日期是否相等
 * @method isEqualDate
 * @param { date1,date2 : Date }
 * @return Boolean
 */
export function isEqualDate(date1, date2, fmt = 'yyyy/MM/dd') {
    let d1 = date1 instanceof Date ? date1 : new Date(date1)
    let d2 = date2 instanceof Date ? date2 : new Date(date2)
    d1 = formatDate(date1, fmt);
    d2 = formatDate(date2, fmt)
    return d1 === d2
}

/**
 * 计算当前日期的下月1号
 * @method nextMonth
 * @param { day : Date }
 * @return [ day :Date]
 */
export function nextMonth(day) {
    let date = day instanceof Date ? day : new Date(day)
    date = new Date(date.valueOf())
    date.setMonth(date.getMonth() + 1)
    date.setDate(1)
    return date
}

/**
 * 计算当前日期的当月的日视图
 * @method getDayView
 * @param { day : Date }
 * @return { Object }
 */
export function getDayView(date) {
    let dayValue = date.valueOf()
    let totalDays = 42 // 日视图总数 7 x 6 
    let dayOne = (new Date(dayValue)) // 用于保存当前月的1号日期
    let lastDate = new Date(dayValue) // 保存上个月日期
    let lastDays = getDays(lastDate) // 上个月的总天数

    let days = getDays(date) // 当前月的总天数
    let nextDays = totalDays - days

    let dayWeek = 1 //保存当前月1号的星期
    let dayView = [] // 当月日视图
    let prevMonth = [] // 保存上月日期
    let nextMonth = [] // 保存下月日期
    let curMonth = [] // 保存当月日期

    // 设置上月日期
    lastDate.setDate(0)
    lastDays = getDays(lastDate)
        // 设置当前日期为1号
    dayOne.setDate(1)
    dayWeek = dayOne.getDay() || 7
    nextDays -= dayWeek
        // 计算上个月日期
    for (let i = dayWeek, j = lastDays; i > 0; i--, j--) {
        prevMonth.push(j)
        dayView.push(j)
    }
    prevMonth = prevMonth.reverse().map(day => new Date(lastDate.getFullYear(), lastDate.getMonth(), day))
    dayView.reverse()
        // 计算当前月日期
    for (let i = 1; i <= days; i++) {
        dayOne.setDate(i)
        dayView.push(i)
        curMonth.push(new Date(dayOne.valueOf()))
    }
    // 计算下个月日期
    dayOne.setDate(days + 1)
    for (let i = 1; i <= nextDays; i++) {
        dayOne.setDate(i)
        dayView.push(i)
        nextMonth.push(new Date(dayOne.valueOf()))
    }

    return {
        curDate: date,
        prevMonth,
        curMonth,
        nextMonth,
        dayView
    }
}