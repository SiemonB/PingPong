define(['Class', 'Display', 'KeyManager'], function (Class, Display, KeyManager) {

    var _this;
    var running = false;
    var title, width, height, g, keyManager;
    var graphics;
    var fpsArray = [];

    var fps = 60; //Desired fps
    var fpsArrayLength = 50; //***Magic Numer*** //Ammount of numbers the fps counter averages over

    var lastTime = Date.now();

    var Game = Class.extend({
        init: function (_title, _width, _height) {
            _this = this;
            title = _title;
            width = _width;
            height = _height;
        },
        run: function () {
            init();
            var timePerTick = 1000 / fps;
            var delta = 0;
            var now;
            var lastTime = Date.now();
            var timer = 0;
            var ticks = 0;
            var debugState = false;

            // Game Loop
            function loop() {
                if (running) {
                    now = Date.now();
                    delta = now - lastTime;
                    timer += delta;
                    lastTime = now;
                }

                if (timer >= timePerTick) {
                    dt = timer / 1000;
                    tick(dt);
                    render();
                    timer = 0;
                }
                window.requestAnimationFrame(loop);

                if (keyManager.debug) debug();


            }
            loop();

        },
        start: function () {
            if (running) return;
            running = true;
            this.run();
        }
    });


    /*
    =============== Functions ===============
    */

    function init() {
        keyManager = new KeyManager();
        display = new Display(title, width, height);
        g = display.getGraphics();

        loadImage();
    }

    function tick() {
        keyManager.tick();
    }

    function render() {

        g.clearRect(0, 0, width, height);

        // Outline of game window.
        g.strokeRect(0, 0, width, height);

        processMove();
        movePlayer();

        getScore();
    }

    var x_p1 = 300,
        x_p2 = 300;
    var moveSpeedModifier = 15;
    var pong_p1 = loadImage().pong,
        pong_p2 = loadImage().pong;

    function movePlayer() { //TODO refractor

        if (keyManager.up_p2) {
            x_p2 -= 1 * moveSpeedModifier;
        }
        if (keyManager.down_p2) {
            x_p2 += 1 * moveSpeedModifier;
        }
        if (x_p2 <= 0) {
            x_p2 = 0;
        }
        if (x_p2 + pong_p2.height >= height) {
            x_p2 = height - pong_p2.height;
        }

        if (keyManager.up_p1) {
            x_p1 -= 1 * moveSpeedModifier;
        }
        if (keyManager.down_p1) {
            x_p1 += 1 * moveSpeedModifier;
        }
        if (x_p1 <= 0) {
            x_p1 = 0;
        }
        if (x_p1 + pong_p1.height >= height) {
            x_p1 = height - pong_p1.height;
        }

        g.drawImage(pong_p2, width - pong_p2.width - 10, x_p2);
        g.drawImage(pong_p1, 10, x_p1);
    }


    var xBall = 400,
        yBall = 300,
        ySpeed,
        xSpeed,
        ball = loadImage().ball;
    resetBall(); // Start posistion

    function processMove() {

        yBall -= ySpeed;
        xBall -= xSpeed;

        // y bounce
        if (yBall >= height - ball.height || yBall <= 0) {
            ySpeed *= -1;
        }

        // Scoring
        if (xBall >= width - ball.width) {
            getScore("p1");
            resetBall();
        } else if (xBall <= 0) {
            getScore("p2");
            resetBall();
        }
        // Paddle bounce
        if (xBall >= width - ball.width - 15 - pong_p2.width && // Checks xpos of paddle
            yBall >= x_p2 && yBall <= x_p2 + pong_p2.height) { // Checks ypos of paddle
            xSpeed *= -1;

            xSpeed *= 1.13;
            ySpeed *= 1.13;
        } else if (xBall <= 0 + pong_p1.width + 15 &&
            yBall >= x_p1 && yBall <= x_p1 + pong_p1.height) {
            xSpeed *= -1;

            xSpeed *= 1.13;
            ySpeed *= 1.13;
        }


        g.drawImage(loadImage().ball, xBall + xSpeed, yBall + ySpeed)

    }

    var scoreP1 = 0,
        scoreP2 = 0;

    function getScore(_player = "") {

        g.fillStyle = "black";
        g.font = "16px Verdana";
        g.fillText("Score:", width / 2 - 15, 15);
        g.fillText(scoreP1, width / 2 - 30, 35);
        g.fillText(scoreP2, width / 2 + 30, 35);

        if (_player == "p1") {
            scoreP1++;
        } else if (_player == "p2") {
            scoreP2++;
        }
    }




    function resetBall() {
        xBall = 400;
        yBall = 300;

        do {
            xSpeed = Math.floor(Math.random() * 15) - 7; //Random number from +5 to -5
            ySpeed = Math.floor(Math.random() * 15) - 7;
        } while (Math.abs(xSpeed) + Math.abs(ySpeed) <= 5 || Math.abs(xSpeed) <= 3)
    }


    /*
    =========== 
    */


    function loadImage() {

        var imgArray = {
            ball: setImg("BallTransparent.png"),
            pong: setImg("Pong.png")
        };


        function setImg(_path) {
            _path = "res/textures/" + _path;

            // Check if path is set
            if (_path != undefined && _path != "" && _path != null) {

                img = new Image();
                img.src = _path;
            } else {
                console.log("Path was not set. : " + _path + " !");
            }
            return img;
        };

        return imgArray;
    }


    /*
    =========== DEBUGGER ===========
    */


    function debug() { /// Maybe Refractor ?

        var actualFps, now, delta;

        //Fps Counter in realtime
        if (running) {
            now = Date.now();
            delta = now - lastTime;
            lastTime = now;
            actualFps = 1000 / delta;

            // Push last FPS into array
            if (fpsArray.length < fpsArrayLength) { // Adds to array when less then aimed value
                fpsArray.push(actualFps);
            }

            // Average FPS
            var sumActualFps = parseInt(fpsArray.reduce(add, 0) / fpsArray.length);

            function add(_a, _b) {
                return _a + _b;
            }

            //Pull first FPS out of array
            if (fpsArray.length >= fpsArrayLength) { // Pulls from array when over aimed value
                fpsArray.shift();
            }
        }


        // Text
        g.fillStyle = "black";
        g.font = "12px Verdana";
        g.fillText("FPS: " + fps + " / " + sumActualFps, 15, 15);

    }

    return Game;
});