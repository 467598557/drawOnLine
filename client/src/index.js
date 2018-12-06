import './less/index.less';

let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
let cache = {
    ctxWidth: window.innerWidth,
    ctxHeight: window.innerHeight,
    fillStyle: "#fff",
    strokeStyle: "#000",
    lineWidth: 6,
    eraserSize: 30
};
let isMobile = (navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i));
let ctxScale = 1;
let ctxTranslateX = 0;
let ctxTranslateY = 0;
let points = [];
let util = {
    fillCtx: function() {
        ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, cache.ctxWidth, cache.ctxHeight);
    }
};
let $drawConfig = $("#drawConfig");
canvas.width = cache.ctxWidth;
canvas.height = cache.ctxHeight;
//背景色
util.fillCtx();

function getPos(event) {
    if(isMobile) {
        event = event.changedTouches[0];
    }

    return  {
        x: event.clientX,
        y: event.clientY
    };
}
function drawLine(beginPoint, controlPoint, endPoint) {
    ctx.beginPath();
    ctx.strokeStyle = cache.strokeStyle;
    ctx.lineWidth = cache.lineWidth;
    ctx.moveTo(beginPoint.x/ctxScale - ctxTranslateX, beginPoint.y/ctxScale - ctxTranslateY);
    ctx.quadraticCurveTo(controlPoint.x/ctxScale - ctxTranslateX, controlPoint.y/ctxScale - ctxTranslateY
        , endPoint.x/ctxScale - ctxTranslateX, endPoint.y/ctxScale - ctxTranslateY);
    ctx.stroke();
    ctx.closePath();
}
function createCtxTransformStyleText() {
    return "scale("+ctxScale+","+ctxScale+") translateX("+(ctxTranslateX)+"px) translateY("+ctxTranslateY+"px)";
}
// 绑定事件
let startPos = [],
    operateType = "draw";
$(canvas).on("touchstart mousedown", function(e) {
    startPos[0] = getPos(e.originalEvent);

    switch (operateType) {
        case "draw":
            points.push(startPos[0]);
            break;
        case "eraser":
            let eraserSize = cache.eraserSize;
            ctx.clearRect(startPos[0].x/ctxScale-ctxTranslateX-eraserSize/2
                , startPos[0].y/ctxScale-ctxTranslateY-eraserSize/2
                , cache.eraserSize, cache.eraserSize);
            break;
    }
}).on("touchmove mousemove", function(e) {
    if(!startPos.length) {
        return;
    }

    e.preventDefault();
    let newPos = getPos(e.originalEvent);
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
                drawLine(startPos[0], controlPoint, endPoint);
                startPos[0] = endPoint;
            }
            break;
        case "eraser":
            let eraserSize = cache.eraserSize;
            ctx.clearRect(newPos.x/ctxScale-ctxTranslateX-eraserSize/2
                , newPos.y/ctxScale-ctxTranslateY-eraserSize/2
                , cache.eraserSize, cache.eraserSize);
            break;
        case "move":
            ctxTranslateX = ctxTranslateX + newPos.x - startPos[0].x;
            ctxTranslateY = ctxTranslateY + newPos.y - startPos[0].y;

            canvas.style.webkitTransform = createCtxTransformStyleText();
            startPos[0] = newPos;
            break;
    }
}).on("touchend mouseup", function(e) {
    startPos.length = 0;
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
    ctxScale = +this.getAttribute("data-scale");
    if(ctxScale == 1) {
        ctxTranslateX = ctxTranslateY = 0;
    }

    canvas.style.webkitTransform = createCtxTransformStyleText();
});
$(".menu-list").on("click", "li", function() {
    $(this).addClass("active").siblings().removeClass("active");
    operateType = this.getAttribute("data-type");
    if(operateType == "draw") {
        $drawConfig.show();
    } else {
        $drawConfig.hide();
    }
});
