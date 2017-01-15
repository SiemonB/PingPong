define(['Class'], function (Class) {
    var canvas, title, width, height, graphics;

    var Display = Class.extend({
        init: function (_title, _width, _height) {
            title = _title;
            width = _width;
            height = _height;
            createDisplay();

        },

        //Getters
        getGraphics: function () {
            return graphics;
        }
    });

    
    /*
    =============== Functions ===============
    */

    function createDisplay() {

        var body = document.body;
        body.innerHTML = ("<canvas id='canvas' width='" + width + "' height='" + height + "'></canvas>");
        canvas = document.getElementById('canvas');

        if (canvas.getContext) {
            document.title = title;
            graphics = canvas.getContext('2d');
        }
    }

    return Display;
});