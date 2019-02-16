// Set body min-width
var bodyHalfWidth = $(window).outerWidth(true)/2;
document.body.style.minWidth = Math.max(1074,bodyHalfWidth);

var PIXEL_RATIO = (function () {
    var ctx = document.createElement("canvas").getContext("2d"),
        dpr = window.devicePixelRatio || 1,
        bsr = ctx.webkitBackingStorePixelRatio ||
              ctx.mozBackingStorePixelRatio ||
              ctx.msBackingStorePixelRatio ||
              ctx.oBackingStorePixelRatio ||
              ctx.backingStorePixelRatio || 1;

    return dpr / bsr;
})();

createHiDPICanvas = function(w, h, ratio) {
    if (!ratio) { ratio = PIXEL_RATIO; }
    var can = document.getElementById("initialCanvas");
    can.width = w * ratio;
    can.height = h * ratio;
    can.style.width = w + "px";
    can.style.height = h + "px";
    can.getContext("2d").setTransform(ratio, 0, 0, ratio, 0, 0);
    return can;
}

var RESOLUTIONVAR = 2;

var $navbarHeight = $('.body-container > nav').outerHeight();
var correctWindowHeight = window.innerHeight

window.addEventListener('resize', resizeCanvas, false);

var c;

var ctx;

var resizeCanvasCalled = false;

resizeCanvas();

var canvasHeight = correctWindowHeight - ($navbarHeight);

function resizeCanvas() {
    c = createHiDPICanvas(window.outerWidth, correctWindowHeight - ($navbarHeight), RESOLUTIONVAR);

    ctx = c.getContext("2d");
    
    resizeCanvasCalled = true;
}

function getRandomInt(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min + 1)) + min
}

let circles = []

function makeCircle(x, y) {
    var circle = {
        x: x,
        y: y,
        r: 100
    }

    circles.push(circle)
}

document.onclick = click
function click(e) {
    makeCircle(e.clientX, e.clientY)
}

function render() {
    requestAnimationFrame(render)

    ctx.clearRect(0, 0, c.width, c.height)

    ctx.fillStyle = 'afafaf'
    ctx.fillRect(0, 0, c.width, c.height)

    circles.forEach(function(circle) {
        ctx.beginPath();
        ctx.fillStyle = 'green';
        ctx.arc(circle.x, circle.y, circle.r, 0, 2 * Math.PI, false);
        ctx.fill();
    })

    // Object
    // ctx.beginPath();
    // ctx.fillStyle = 'green';
    // ctx.arc(object.x, object.y, object.r, 0, 2 * Math.PI, false);
    // ctx.fill();
}

requestAnimationFrame(render);
