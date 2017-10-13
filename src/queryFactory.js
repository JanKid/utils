function queryFactory(query,fn) {
	var isExecuted = false
	function _next () {
		if (query.length>0) {
			if (isExecuted) return
			isExecuted = true
			var curQuery = query.shift()
			fn&&fn(curQuery,_next)
			isExecuted = false
		}
	}
	return {
		start:_next
	}
}
/* 使用方法  factory与query 要先初始化   */
/* var factory =  queryFactory(query,fn) query 是队列，fn是重复执行的方法 */
/*    factory.start() 开始执行                                            */