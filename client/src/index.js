import './less/index.less';

let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
let cache = {
    ctxWidth: window.innerWidth,
    ctxHeight: window.innerHeight,
    fillStyle: "#fff",
    strokeStyle: "#000",
    lineWidth: 2,
    eraserSize: 24,
    ctxScale: 1,
    ctxTranslateX: 0,
    ctxTranslateY: 0
};
let points = [];
let util = {
    fillCtx: function() {
        ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, cache.ctxWidth, cache.ctxHeight);
    }
};
canvas.width = cache.ctxWidth;
canvas.height = cache.ctxHeight;
ctx.scale(cache.ctxScale, cache.ctxScale);
//背景色
util.fillCtx();

function drawLine(beginPoint, controlPoint, endPoint) {
    let translateX = cache.ctxTranslateX;
    let translateY = cache.ctxTranslateY;
    let scale = cache.ctxScale;
    ctx.beginPath();
    ctx.strokeStyle = cache.strokeStyle;
    ctx.lineWidth = cache.lineWidth;
    ctx.moveTo(beginPoint.x/scale - translateX, beginPoint.y/scale - translateY);
    ctx.quadraticCurveTo(controlPoint.x/scale - translateX, controlPoint.y/scale - translateY
        , endPoint.x/scale - translateX, endPoint.y/scale - translateY);
    ctx.stroke();
    ctx.closePath();
}
function createCtxTransformStyleText() {
    let scale = cache.ctxScale;
    return "scale("+scale+","+scale+") translateX("+(cache.ctxTranslateX)+"px) translateY("+cache.ctxTranslateY+"px)";
}
// 绑定事件
let startPos = null,
    beginPos = null,
    operateType = "draw";
$(canvas).on("touchstart", function(e) {
    let touch = e.originalEvent.targetTouches[0];
    startPos = {
        x: touch.clientX,
        y: touch.clientY
    };

    switch (operateType) {
        case "draw":
            points.push(startPos);
            break;
        case "eraser":
            let eraserSize = cache.eraserSize;
            ctx.clearRect(startPos.x-eraserSize/2, startPos.y-eraserSize/2, cache.eraserSize, cache.eraserSize);
            break;
    }
}).on("touchmove", function(e) {
    let touch = e.originalEvent.targetTouches[0];
    e.preventDefault();
    let newPos = {
        x: touch.clientX,
        y: touch.clientY
    };
    switch (operateType) {
        case "draw":
            points.push(newPos);
            if (points.length > 3) {
                const lastTwoPoints = points.slice(-2);
                const controlPoint = lastTwoPoints[0];
                const endPoint = {
                    x: (lastTwoPoints[0].x + lastTwoPoints[1].x) / 2,
                    y: (lastTwoPoints[0].y + lastTwoPoints[1].y) / 2,
                }
                drawLine(startPos, controlPoint, endPoint);
                startPos = endPoint;
            }
            break;
        case "eraser":
            let eraserSize = cache.eraserSize;
            ctx.clearRect(newPos.x-eraserSize/2, newPos.y-eraserSize/2, cache.eraserSize, cache.eraserSize);
            break;
        case "move":
            let translateX = cache.ctxTranslateX + newPos.x - startPos.x;
            let translateY = cache.ctxTranslateY + newPos.y - startPos.y;

            cache.ctxTranslateX = translateX;
            cache.ctxTranslateY = translateY;
            canvas.style.webkitTransform = createCtxTransformStyleText();
            startPos = newPos;
            break;
    }
}).on("touchend", function(e) {
    startPos = null;
    points = [];
});
$(".color-list").on("click", "li", function() {
    $(this).addClass("active").siblings().removeClass("active");
    cache.strokeStyle = this.getAttribute("data-color");
});
$(".line-list").on("click", "li", function() {
    $(this).addClass("active").siblings().removeClass("active");
    cache.lineWidth = this.getAttribute("data-line");
});
$(".eraser-size-list").on("click", "li", function() {
    $(this).addClass("active").siblings().removeClass("active");
    cache.eraserSize = this.getAttribute("data-size");
});
$(".scale-list").on("click", "li", function() {
    $(this).addClass("active").siblings().removeClass("active");
    let ctxScale = +this.getAttribute("data-scale");
    cache.ctxScale = ctxScale;
    canvas.style.webkitTransform = createCtxTransformStyleText();
});
$("#operateType").on("change", function() {
    operateType = this.value;
});