// Thurmann Pangilinan
// Rocket Patrol & Knuckles (featuring Dante from the Devil May Cry series)
// 1,000,000 hours
// 

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