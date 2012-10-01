var MathCanvas = (function () {

    var _sequence = {
        scaling: 3,
        iterations: 3000,
        seq: function(n) {
            //return Math.pow(Math.log(n),4)
            //return Math.pow(n,2)/1234;
            return Math.sin(Math.sqrt(n));
        }
    };

    var _setScaling = function(scaling) {
        _sequence.scaling = scaling;
    };

    var _setIterations = function(iterations) {
        _sequence.iterations = iterations;
    };

    var _setSequence = function(sequence) {
        _sequence = sequence;
    };


    var _initOverlay = function(flapId, overlayId, height) {
        var flapDiv = document.getElementById(flapId);
        var collapsed = false;
        flapDiv.onclick = function() {
            var controls = document.getElementById(overlayId);
            controls.style.top = collapsed ? "0px" : "-"+height;
            collapsed = !collapsed;
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
                _draw(ctx, centerX, centerY, _sequence.scaling, _sequence.iterations);
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

        _draw(ctx, centerX, centerY, _sequence.scaling, _sequence.iterations);
    };

    var _draw = function (ctx, cx, cy, sf, N) {
        var x = cx;
        var y = cy;
        var x1;
        var y1;
        var xn;
        for (var i = 0; i < N; i++) {
            xn = _sequence.seq(i);
//            console.log(xn);
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

    // public

    return {
        initCanvas: _initCanvas,
        initOverlay: _initOverlay,
        setSequence: _setSequence,
        setScale: _setScaling,
        setIterations: _setIterations
    }

}());
