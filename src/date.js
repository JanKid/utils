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
 * 计算当前日期的当月的日视图
 * @method getDayView
 * @param { day : Date }
 * @return { Object }
 */
export function getDayView(date) {
    let dayValue = date.valueOf()
    let totalDays = 42 // 日视图总数 7 x 6 
    let dayOne = (new Date(dayValue)) // 用于保存当前月的1号日期
    let lastDate = new Date(date.getFullYear(), date.getMonth() - 1, 1) // 保存上个月1号
    let lastDays = getDays(lastDate) // 上个月的总天数

    let days = getDays(date) // 当前月的总天数
    let nextDays = totalDays - days

    let dayWeek = 1 //保存当前月1号的星期
    let dayView = [] // 当月日视图
    let prevMonth = [] // 保存上月日期
    let nextMonth = [] // 保存下月日期
    let curMonth = [] // 保存当月日期

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