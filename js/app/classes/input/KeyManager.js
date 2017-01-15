define(['Class'], function (Class) {
    /*
    keys[x]
    x= Javascript Char Codes (Key Codes)
    */

    var keys = [];
    var keyHold = []; // TODO, need cleaner solution for toggling with keys...

    var KeyManager = Class.extend({
        init: function () {},
        tick: function () {

            this.up_p1 = keys[87]; // "W" key
            this.down_p1 = keys[83]; // "S" key
            //this.left = keys[65];       // "A" key
            //this.right = keys[68];      // "D" key

            this.up_p2 = keys[38]; // "Up" key
            this.down_p2 = keys[40]; // "Down" key
            //this.left = keys[37]; // "Left" key
            //this.right = keys[39]; // "Right" key

            this.debug = keyHold[113]; // "F2" key
        }
    });

    window.onkeydown = function (e) {
        keys[e.keyCode] = true;
        keyHold[e.keyCode] = keyHold[e.keyCode] != true; // Sets to true when false, and vice versa
    };

    window.onkeyup = function (e) {
        keys[e.keyCode] = false;
    };

    return KeyManager;
});