requirejs.config({

    "baseUrl": "js",
    "paths": {
        //Libs
        "Class": "libs/class",
        "Jquery": "libs/jquery",
        //Classes
        "Launcher": "app/classes/Launcher",
        "Game": "app/classes/Game",
        "Display": "app/classes/Display",
        "KeyManager": "app/classes/input/KeyManager"


    }
});

require(['app/main']);