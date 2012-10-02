var MathCanvas = (function () {

    var Canvas = (function() {
        var _centerX,
            _centerY,
            _ctx,
            _canvas,
            _sequence;

        var _dragOk = false;
        var _prevX = -1;
        var _prevY = -1;

        var _clear = function() {
            _ctx.clearRect(0, 0, _canvas.width, _canvas.height);
        };

        var _repaint = function() {
            _clear();
            _draw(_ctx, _centerX, _centerY, _sequence.scaling, _sequence.iterations);
        };

        var _init = function(containerId, canvasId, sequence) {
            _sequence = sequence;
            var canvas_div = document.getElementById(containerId);
            _canvas = document.getElementById(canvasId);

            _canvas.width = canvas_div.clientWidth;
            _canvas.height = canvas_div.clientHeight;

            window.onresize = function () {
                _canvas.width = canvas_div.clientWidth;
                _canvas.height = canvas_div.clientHeight;
                _repaint();
            };

            _ctx = _canvas.getContext('2d');

            _centerX = _canvas.width / 2;
            _centerY = _canvas.height / 2;

            _canvas.onmousedown = _myDown;
            _canvas.onmouseup = _myUp;

            _repaint();
        };

        var _myMove = function(e) {
            console.log("MOVE");
            if (dragok) {
                console.log("MOVE ok");
                var x = e.pageX;
                var y = e.pageY;
                _centerX += x - _prevX;
                _centerY += y - _prevY;
                _repaint();
                _prevY = y;
                _prevX = x;
            }
        };

        var _myDown = function(e) {
            console.log("DOWN");
            _prevX = e.pageX;
            _prevY = e.pageY;
            dragok = true;
            _canvas.onmousemove = _myMove;
        };

        var _myUp = function() {
            console.log("UP");
            dragok = false;
            _canvas.onmousemove = null;
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

        var _setScaling = function(scaling) {
            _sequence.scaling = scaling;
            _repaint();
        };

        var _setIterations = function(iterations) {
            _sequence.iterations = iterations;
            _repaint();
        };

        var _setSequence = function(sequence) {
            _sequence = sequence;
            _repaint();
        };

        return {
            init: _init,
            setSequence: _setSequence,
            setScaling: _setScaling,
            setIterations: _setIterations
        };

    }());

    var _sequences = [
        {
            scaling: 3,
            iterations: 3000,
            seq: function(n) { return Math.sin(Math.sqrt(n)); }
        },
        {
            scaling: 3,
            iterations: 3000,
            seq: function(n) { return Math.pow(Math.log(n),4); }
        },
        {
            scaling: 3,
            iterations: 3000,
            seq: function(n) { return Math.pow(n,2)/1234; }
        }
    ];

    var _initControls = function(flapId, overlayId) {
        var controls = document.getElementById(overlayId);
        var flapDiv = document.getElementById(flapId);
        var collapsed = true;
        var collapsedTop = "-295px"; //controls.parentNode.height;
        flapDiv.onclick = function() {
            controls.style.top = collapsed ? "0px" : collapsedTop;
            collapsed = !collapsed;
        };

        var select = document.getElementById('sequence');
        select.onchange = function() {
            Canvas.setSequence(_sequences[select.selectedIndex]);
        };

        var scale = document.getElementById('scaling');
        scale.onchange = function() {
            Canvas.setScaling(scale.value);
        };
        var iterations = document.getElementById('iterations');
        iterations.onchange = function() {
            Canvas.setIterations(iterations.value);
        }
    };

    // public

    return {
        initControls: _initControls,

        initCanvas: function(containerId, canvasId) {
            Canvas.init(containerId, canvasId, {
                scaling: 3,
                iterations: 3000,
                seq: function(n) {
                    //return Math.pow(Math.log(n),4)
                    //return Math.pow(n,2)/1234;
                    return Math.sin(Math.sqrt(n));
                }
            });
        },

        setScaling: function(scaling) {
            Canvas.setScaling(scaling);
        },

        setIterations: function(iterations) {
            Canvas.setIterations(iterations);
        },

        setSequence: function(sequence) {
            Canvas.setSequence(sequence);
        }

    }

}());
