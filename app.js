var MathCanvas = (function () {

    var init = function(containerId, canvasId, flapId, controlsHeight) {
        _initCanvas(containerId, canvasId);
        _initOverlay(flapId, controlsHeight);
    };

    var _initOverlay = function(flapId, height) {
        var flapDiv = document.getElementById(flapId);
        var collapsed = false;
        flapDiv.onclick = function() {
            var controls = document.getElementById('overlay');
            controls.style.top = collapsed ? "0px" : "-100px";
            collapsed = !collapsed;
            console.log(collapsed, controls.style.top);
        };
    };

    var _initCanvas = function(containerId, canvasId) {
        var canvas_div = document.getElementById(containerId);
        var canvas = document.getElementById(canvasId);

        canvas.width = canvas_div.clientWidth;
        canvas.height = canvas_div.clientHeight;

        window.onresize = function () {
            canvas.width = canvas_div.clientWidth;
            canvas.height = canvas_div.clientHeight;
        };

        var ctx = canvas.getContext('2d');

        var centerX = canvas.width / 2;
        var centerY = canvas.height / 2;
        var prevX = -1;
        var prevY = -1;
        var scaleFactor = 3;
        var nrOfIterations = 3000;

        var dragok = false;

        function clear() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }

        function myMove(e) {
            if (dragok) {
                var x = e.pageX;
                var y = e.pageY;
                centerX += x - prevX;
                centerY += y - prevY;
                clear();
                _draw(ctx, centerX, centerY, scaleFactor, nrOfIterations);
                prevY = y;
                prevX = x;
            }
        }

        function myDown(e) {
            prevX = e.pageX;
            prevY = e.pageY;
            dragok = true;
            canvas.onmousemove = myMove;
        }

        function myUp() {
            console.log("up");
            dragok = false;
            canvas.onmousemove = null;
        }

        canvas.onmousedown = myDown;
        canvas.onmouseup = myUp;

        _draw(ctx, centerX, centerY, scaleFactor, nrOfIterations);
    };

    var _sequence = function(n) {
        //return Math.pow(Math.log(n),4)
        //return Math.pow(n,2)/1234;
        return Math.sin(Math.sqrt(n));
    };

    var _draw = function (ctx, cx, cy, sf, N) {
        var x = cx;
        var y = cy;
        var x1;
        var y1;
        var xn;
        for (var i = 0; i < N; i++) {
            xn = _sequence(i);
            //console.log(xn);
            var xIn = 2 * Math.PI * xn;
            //console.log(xIn);
            x1 = x + sf * Math.cos(xIn);
            y1 = y + sf * Math.sin(xIn);
            //console.log(x,y,x1,y1);

            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x1, y1);
            //ctx.closePath();
            ctx.stroke();
            x = x1;
            y = y1;
        }
    };

    var setSequence = function(sequence) {
        this._sequence = sequence;
    };

    return {
        init: init,
        setSequence: setSequence
    }

}());
