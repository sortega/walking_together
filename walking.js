var HOUR_MILLIS = 60 * 60 * 1000;
var DAY_MILLIS = 24 * HOUR_MILLIS;
var ORIGIN = Date.parseExact("01/02/2011", "MM/dd/yyyy");

function updateTime() {
    var today = Date.today();

    var days = Math.floor((today.days() - ORIGIN.days()) /
	    DAY_MILLIS);
    $('time').innerHTML = days + " days";

    var weeks = Math.floor((today.days() - ORIGIN.days()) /
	    (7 * DAY_MILLIS));
    $('weeks').innerHTML = weeks + " weeks";

    var months = monthsBetween(ORIGIN, today);
    $('months').innerHTML = months + " months";

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
    var years = yearsBetween(ORIGIN, Date.today());
    if (years > 0) {
	$('years').innerHTML = years + " year" + 
	    ((years > 1)? "s": "");
    }
}

function yearsBetween(from, to) {
    return unitsBetween({years: 1}, from, to);
}

function animate(node, path, startingFrame, fps) {
    var frame = startingFrame;
    window.setInterval(function tick() {
	    node.removeClassName('sprite0');
	    node.removeClassName('sprite1');
	    node.removeClassName('sprite2');
	    node.removeClassName('sprite3');
	    node.addClassName('sprite' + frame % 4);

	    var pos = path(frame);
	    node.setStyle({
		left: pos[0],
		top: pos[1]
	    });

	    frame += 1;
    }, 1000/fps);
}

function scroll(node, fps) {
    var delta = 0;
    window.setInterval(function tick() {
	    node.setStyle({ backgroundPosition: "0 " + delta + "px"});
	    delta = (delta - 1) % 128;
    }, 1000/fps);
}

function constant(x, y) {
    return function(t) {
	return [x, y];
    };
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

document.observe('dom:loaded', function() {
    updateTime();
    window.setInterval(function updateTime() {
	updateTime();
    }, HOUR_MILLIS);

    var person_fps = 5;
    //animate($('sebas'), constant(225, 135), 0, person_fps);
    //animate($('kesi'), constant(190, 140), 1, person_fps);
    //animate($('sebas'), linear(250, 0, 225, 135, 200), 0, person_fps);
    //animate($('kesi'), linear(165, 0, 190, 140, 200), 1, person_fps);
    animate($('sebas'), asymptotic(250, 0, 225, 135, 200), 0, person_fps);
    animate($('kesi'),  asymptotic(165, 0, 190, 140, 200), 1, person_fps);

    var background_fps = 30;
    scroll($('frame'), background_fps);
});
