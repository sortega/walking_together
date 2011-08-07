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

function animate(node, startingFrame, fps) {
    var frame = startingFrame;
    window.setInterval(function tick() {
	    node.removeClassName('sprite0');
	    node.removeClassName('sprite1');
	    node.removeClassName('sprite2');
	    node.addClassName('sprite' + frame);
	    frame = (frame + 1) % 3;
    }, 1000/fps);
}

function scroll(node, fps) {
    var delta = 0;
    window.setInterval(function tick() {
	    node.setStyle({ backgroundPosition: "0 " + delta + "px"});
	    delta = (delta - 1) % 128;
    }, 1000/fps);
}

document.observe('dom:loaded', function() {
	updateTime();
	window.setInterval(function updateTime() {
	    updateTime(); 
	    }, HOUR_MILLIS);

	var person_fps = 5;
	animate($('sebas'), 0, person_fps);
	animate($('kesi'), 1, person_fps);

	var background_fps = 30;
	scroll($('frame'), background_fps);
});

