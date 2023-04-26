// Thurmann Pangilinan
// Rocket Patrol: Epic Edition
// Completion Time: 10 hours
// 
// Mod List:
//  - Allow the player to control the Rocket
//    after it's fired (5)
//  - Speed increase after 30 seconds (5)
//  - Display time remaining (in seconds)
//    on the screen (10)

let config = {
    type: Phaser.CANVAS,
    width: 640,
    height: 480,
    scene: [ Menu, Play ]
}

// create game object
let game = new Phaser.Game(config);
// reserve keyboard names
let keyF, keyR, keyLEFT, keyRIGHT;
// set UI sizes
let borderUISize = game.config.height / 15;
let borderPadding = borderUISize / 3;