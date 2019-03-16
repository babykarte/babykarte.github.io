var testdata = "Mo-Fr 08:00-12:00,13:00-17:30; Sa 08:00-12:00";
var ohInstance = Object();
ohInstance.result = [];
ohInstance.constants = {
"days": ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su", "Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
"months": ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]};
ohInstance.parse = function(oh) {
	ohInstance.input = oh;
}
ohInstance._range = function(range, constant) {
	range = range.split("-");
	var startIndex = 0;
	var endIndex = 0;
	var array = ohInstance.constants[constant];
	try {
		var from = parseInt(range[0]);
		var to = parseInt(range[1]);
		console.log("bla");
		return range
	} catch {}
	//Detect position in list of 'from'
	for (var i in array) {
		if (array[i] == from) {
			startIndex = i;
		}
	}
	//Detect position in list of 'to'
	var i = startIndex;
	for (i in array) {
		if (array[i] == from) {
			endIndex = i;
		}
	}
	if (startIndex == 0) {
		return range;
	} else if (endIndex == 0) {
		return range;
	}
	return array.slice(startIndex, endIndex).join(",");
}
ohInstance.rangeDays = function(range) {
	return ohInstance._range(range, "days");
}
ohInstance.rangeMonths = function(range) {
	return ohInstance._range(range, "months");
}
ohInstance.isConstantExpression = function (expression, constant) {
	var entry = expression.split("-");
	var matches = 0;
	for (var i in ohInstance.constants[constant]) {
		for (var u in entry) {
			if (entry[u] == ohInstance.constants[constant][i]) {
				matches += 1;
			}
		}
	}
	if (matches == entry.length) {
		return true;
	}
	return false;
}
ohInstance.isMonthExpression = function(expression) {
	return ohInstance.isConstantExpression(expression, "months");
}
ohInstance.isWeekdayExpression = function(expression) {
	return ohInstance.isConstantExpression(expression, "days");
}
ohInstance.main = function() {
	var statement = ohInstance.input.split(";");
	statement.forEach(function(entry) {
		var output = "";
		entry = entry.split(",");
		entry.forEach(function(entry) {
			item = entry.split(" ");
			for (var i in item) {
				if (item[i].endsWith(":")) {
					//Opening hours for a month
					output = item[i].replace(":", "");
					
				} else if (ohInstance.isMonthExpression(item[i])) {
					//Specified day/days in a month
				} else if (ohInstance.isWeekdayExpression(item[i])) {
					//Specified weekday/weekdays
				}
			}
		});
	});
	return output.join(",")
}
ohInstance.parse(testdata);
console.log(ohInstance.main());
