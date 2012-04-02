var HOUR_MILLIS = 60 * 60 * 1000;
var DAY_MILLIS = 24 * HOUR_MILLIS;
var ORIGIN = Date.parseExact("01/02/2011", "MM/dd/yyyy");

function updateTime() {
    var today = Date.today();

    var days = (today.days() - ORIGIN.days()) / DAY_MILLIS;
    $('#time').html(Math.floor(days) + " days");

    var weeks = (today.days() - ORIGIN.days()) / (7 * DAY_MILLIS);
    var weeksText = formatTime(Math.floor(weeks), "week");
    if (weeks - Math.floor(weeks) < 1/7)
        weeksText = markAsUpdated(weeksText);
    $('#weeks').html(weeksText);

    var months = monthsBetween(ORIGIN, today);
    var monthText = formatTime(months, "month");
    if (today.getDay() == ORIGIN.getDay())
        monthText = markAsUpdated(monthText);
    $('#months').html(monthText);

    updateYears();
}

function unitsBetween(unit, from, to) {
    var moment = from.clone();
    var units = 0;
    moment.add(unit);
    while (moment.compareTo(to) < 1) {
	moment.add(unit);
	units++;
    }
    return units;
}

function monthsBetween(from, to) {
    return unitsBetween({months: 1}, from, to);
}

function updateYears() {
    var today = Date.today();
    var years = yearsBetween(ORIGIN, today);
    if (years > 0) {
        var yearsText = formatTime(years, "year");
        if (ORIGIN.getMonth() == today.getMonth() && ORIGIN.getDay() == today.getDay())
            yearsText = markAsUpdated(yearsText);
    	$('#years').html(yearsText);
    }
}

function yearsBetween(from, to) {
    return unitsBetween({years: 1}, from, to);
}

function markAsUpdated(text) {
    return '<span class="updated">' + text + '</span>';
}

function formatTime(amount, unit) {
    var text = amount + " " + unit;
    text += (amount != 1)? "s" : "";
    return text;
}

function animate(node, path, startingFrame, fps) {
    var frame = startingFrame;
    window.setInterval(function tick() {
	    node.removeClass('sprite0');
	    node.removeClass('sprite1');
	    node.removeClass('sprite2');
	    node.removeClass('sprite3');
	    node.addClass('sprite' + frame % 4);

	    var pos = path(frame);
	    node.css({
		left: pos[0],
		top: pos[1]
	    });

	    frame += 1;
    }, 1000/fps);
}

function scroll(node, fps) {
    var delta = 0;
    window.setInterval(function tick() {
	    node.css({ backgroundPosition: "0 " + delta + "px"});
	    delta = (delta - 1) % 128;
    }, 1000/fps);
}

function constant(x, y) {
    return function(t) {
	return [x, y];
    };
}

function cycle(x1, y1, x2, y2, frames) {
    var lin = linear(x1, y1, x2, y2, frames);
    return function (t) {
	return lin(t % frames);
    }
}

function linear(x1, y1, x2, y2, frames) {
    return function (t) {
	if (t < frames) {
	    return [
		x1 + (x2 - x1) * (t/frames),
		y1 + (y2 - y1) * (t/frames)
	       ];
	} else {
	    return [x2, y2];
	}
    };
}

function asymptotic(x1, y1, x2, y2, halflife) {
    return function (t) {
	var progress = 1 - Math.pow(Math.E, -t/halflife);
	return [
	    x1 + (x2 - x1) * progress,
	    y1 + (y2 - y1) * progress
	];
    };
}

// 1 -> day; 0 -> night; sunrise/sunset in between
function dailyness(date) {
    var month = date.getMonth();
    var day = date.getDate();
    var year = date.getFullYear();
    var timezone = -1;

    var result = SunriseSunset(8, 14, 2011, 0, 40, 25, 0, 3, 41, 0);

    var sunrise = Date.today();
    sunrise.setHours(result.riseHours);
    sunrise.setMinutes(result.riseMinutes);

    var sunset = Date.today();
    sunset.setHours(result.setHours);
    sunset.setMinutes(result.setMinutes);

    if (date.between(sunrise, sunset)) {
	return 1;
    } else {
	// Sunrise/sunset transition
	var period = 600;
	var secondsBeforeSunrise = 
	    Math.abs(sunrise.getTime() - date.getTime()) / 1000;
	var secondsAfterSunset = 
	    Math.abs(date.getTime() - sunset.getTime()) / 1000;
	return 1 - Math.min(1, 
		secondsBeforeSunrise/period,
		secondsAfterSunset/period);

    }
}

function animateDayNight() {
    var fps = 1;
    var shade = $('#shade');

    function tick () {
	var dness = dailyness(new Date());
	shade.css('zIndex', (dness < 1) ? 1 : -1);
	var alpha = 0.4;
	shade.css('backgroundColor', "rgba(0, 0, 255, " + 
	    alpha*(1-dness) + ")");
    }

    tick();
    setInterval(tick, 1000/fps);
}

$(document).ready(function() {
    updateTime();
    window.setInterval(function updateTime() {
	updateTime();
    }, HOUR_MILLIS);

    var person_fps = 5;
    //animate($('sebas'), constant(225, 135), 0, person_fps);
    //animate($('kesi'), constant(190, 140), 1, person_fps);
    //animate($('sebas'), linear(250, 0, 225, 135, 200), 0, person_fps);
    //animate($('kesi'), linear(165, 0, 190, 140, 200), 1, person_fps);
    animate($('#sebas'), asymptotic(250, 0, 225, 135, 200), 0, person_fps);
    animate($('#kesi'),  asymptotic(165, 0, 190, 140, 200), 1, person_fps);

    var background_fps = 30;
    //animate($('sign'), cycle(320, 320, 320, -32, 352), 0, background_fps);
    scroll($('#frame'), background_fps);

    animateDayNight();
});
