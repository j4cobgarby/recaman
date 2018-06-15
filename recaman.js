var canvas;
var ctx;
var fb4u;

var vmid = 300;
var scalar = 10;
var limit = 500;
var delay = 50;
var trans = 0;
var scale = 1;
var frame_mod = 0;
var halfwidth;
var lookback = scalar;
var scalarscalar = 1;
var frameb4update = 5;
var running = false;

scalarscalar -= (1/frameb4update*0.01);
console.log(scalarscalar);

var seq = [0]; // sequence starts at 0
function init() {
    canvas = document.getElementById("canv");
    fb4u = document.getElementById("fb4u");

    fb4u.value = frameb4update;
    
    if (window.devicePixelRatio) {
        console.log(devicePixelRatio);

        var height = canvas.getAttribute("height");
        var width  = canvas.getAttribute("width");

        canvas.setAttribute("width", Math.round(width * window.devicePixelRatio));
        canvas.setAttribute("height", Math.round(height * window.devicePixelRatio));

        canvas.style.width = width + "px";
        canvas.style.height = height + "px";
    }

    ctx = canvas.getContext("2d");

    halfwidth = canvas.width / 2;

    console.log("Initialised.");
}

function set_frameb4update(val) {
    frameb4update = val;
    scalarscalar = 1 - (1/frameb4update*0.01);
}

function next_num() {
    var diff = seq.length;
    var last = seq[seq.length -1];
    var can_go_back = true;
    var next;

    if (last - diff < 0 || seq.includes(last-diff)) {
        can_go_back = false;
    }

    if (can_go_back) {
        next = last - diff;
    } else {
        next = last + diff;
    }

    seq.push(next);
    return next;
}

function arc_between(a, b, clockwise) {
    var min = Math.min(a, b);
    var max = Math.max(a, b);
    var rad = (max - min) / 2.0; // half the distance between them
    var centre = min + rad;

    ctx.arc(centre*scalar, vmid, rad*scalar, 0, Math.PI, clockwise);
    ctx.stroke();
}

function draw_seq(start=0) {
	var clockwise = (start % 2 == 0);
	if (seq.length < 2) {
		return;
	}
	for (var i = start+1; i < seq.length; i++) {
		arc_between(seq[i-1], seq[i], clockwise);
		clockwise = !clockwise;
	}
}

function lerp(from, to, prog) {
        return from + (to - from) * prog;
}

function update() {
    if (running) {
        frame_mod++;
        frame_mod %= frameb4update;
        if (frame_mod == 0) {
            next_num();
        }
        canvas.width = canvas.width;
        trans = lerp(trans, seq[seq.length-1]*scalar, 0.01);
        ctx.translate(-trans + halfwidth, 0);
        scalar *= scalarscalar;
        draw_seq();
    }

	requestAnimationFrame(update);
}

function run() {
    init();

    var clockwise = true;

    ctx.strokeStyle = "black";
    ctx.lineWidth = 0.5;

    update();    
}
