// Thurmann Pangilinan
// Rocket Patrol: Epic Edition
// Completion Time: 10 hours
// 
// Mod List:
//  - Allow the player to control the Rocket
//    after it's fired (5)
//  - Speed increase after 30 seconds (5)
//  - High score that persists across scenes
//    and is displayed in UI (5)
//  - Add (copyright-free) background music
//    to the Play scene (5)
//  - Display time remaining (in seconds)
//    on the screen (10)
//  - New enemy Spaceship type that's smaller,
//    moves faster, and is worth more points (15)
//
// Sources:
// - Game background music: Persistent Alien Mysteries
//   by Speck (c) copyright 2023 Licensed under a
//   Creative Commons Attribution Noncommercial  (3.0) license.
//   https://dig.ccmixter.org/files/speck/66194 Ft: Apoxode,
//   Ben Blohowiak, Martijn de Boer, abhishekkr
// - Menu music: An Hour Adrift by Ezra Skull (c)
//   copyright 2023 Licensed under a Creative Commons
//   Attribution Noncommercial  (3.0) license.
//   https://dig.ccmixter.org/files/Haskel/66099 Ft: Airtone

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