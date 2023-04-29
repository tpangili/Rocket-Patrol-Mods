class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");
    }

    preload() {
        // load audio
        this.load.audio('sfx_select', './assets/blip_select12.wav');
        this.load.audio('sfx_explosion', './assets/explosion38.wav');
        this.load.audio('sfx_scream', './assets/scream.wav');
        this.load.audio('bgm_normal', './assets/normal_music.wav');
        this.load.audio('bgm_menu', './assets/menu_music.wav');
        this.load.audio('sfx_rocket', './assets/rocket_shot.wav');
        // load title screen image
        this.load.image('title', './assets/title_screen.png');
    }

    create() {
        // Adds tile sprite for the title screen
        this.title_screen = this.add.tileSprite(0, 0, 640, 480, 'title').setOrigin(0, 0);

        // menu text configuration
        let menuConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            color: '#FFFFFF',
            stroke: '#FFFFFF',
            strokeThickness: 1,
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 0
        }

        // show menu text
        //this.add.text(game.config.width/2, game.config.height/2 - borderUISize - borderPadding, 'ROCKET PATROL', menuConfig).setOrigin(0.5);
        this.add.text(game.config.width/2, game.config.height/2 + borderUISize*2 + borderPadding*2, 'Use the mouse to move & (F) to fire', menuConfig).setOrigin(0.5);
        this.add.text(game.config.width/2, game.config.height/2 + borderUISize*4 + borderPadding*2, 'Press ← for Novice or → for Expert', menuConfig).setOrigin(0.5);

        // define keys
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);

        // menu background music
        this.music = this.sound.add('bgm_menu');
        let musicConfig = {
            mute: false,
            volume: 1,
            rate: 1,
            detune: 0,
            seek: 0,
            loop: true,
            delay: 0
        }
        this.music.play(musicConfig);
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            // easy mode
            game.settings = {
                alienSpeed: 5,
                spaceshipSpeed: 3,
                gameTimer: 60000,
                speedTimer: 30000,   // Time until speed increases
            }
            this.sound.play('sfx_select');
            this.music.stop();
            this.scene.start('playScene');
        }
        if (Phaser.Input.Keyboard.JustDown(keyRIGHT)) {
            // hard mode
            game.settings = {
                alienSpeed: 6,
                spaceshipSpeed: 4,
                gameTimer: 45000,
                speedTimer: 30000,  // Time until speed increases
            }
            this.sound.play('sfx_select');
            this.music.stop();
            this.scene.start('playScene');
        }
    }
}