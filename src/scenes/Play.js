// Global high score variable.
var highScore = 200;

class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    preload() {
        // load images/tile sprites
        this.load.image('rocket', './assets/rocket.png');
        this.load.image('starfield', './assets/starfield_new.png');
        this.load.image('dust', './assets/spacedust.png');
        this.load.image('debris', './assets/debris.png');
        this.load.image('splode', './assets/explode_bit.png');
        // load texture atlases
        this.load.atlas('alien', './assets/aliendude.png', './assets/aliendude.json');
        this.load.atlas('new_ship', './assets/spaceship_new.png', './assets/spaceship_new.json');
        // load spritesheet
        this.load.spritesheet('explosion', './assets/explosion.png', {frameWidth: 64, frameHeight: 32, startFrame: 32, startFrame: 0, endFrame: 9});
    }

    create() {
        // place tile sprites
        this.starfield = this.add.tileSprite(0, 0, 640, 480, 'starfield').setOrigin(0, 0);
        this.debris = this.add.tileSprite(0, 0, 640, 480, 'debris').setOrigin(0, 0);
        
        // add new spaceship type: alien
        this.alien = new Spaceship(this, game.config.width + borderUISize*9, borderUISize*4, 'alien', 'alien_1', 50, game.settings.alienSpeed).setOrigin(0, 0);
        // add spaceships (x3)
        this.ship01 = new Spaceship(this, game.config.width + borderUISize*6, borderUISize*5 + borderPadding*2, 'new_ship', 'ship_1', 30, game.settings.spaceshipSpeed).setOrigin(0, 0);
        this.ship02 = new Spaceship(this, game.config.width + borderUISize*3, borderUISize*6 + borderPadding*4, 'new_ship', 'ship_1', 20, game.settings.spaceshipSpeed).setOrigin(0,0);
        this.ship03 = new Spaceship(this, game.config.width, borderUISize*6 + borderPadding*9, 'new_ship', 'ship_1', 10, game.settings.spaceshipSpeed).setOrigin(0,0);

        // alien animation config
        this.anims.create({
            key: 'run',
            frameRate: 12,
            repeat: -1,
            frames: this.anims.generateFrameNames('alien', {
                prefix: 'alien_',
                start: 1,
                end: 4
            })
        })
        this.anims.create({
            key: 'death',
            frameRate: 24,
            repeat: 0,
            frames: this.anims.generateFrameNames('alien', {
                prefix: 'death_',
                start: 1,
                end: 13
            })
        })

        // spaceship animation config
        this.anims.create({
            key: 'fly',
            frameRate: 24,
            repeat: -1,
            frames: this.anims.generateFrameNames('new_ship', {
                prefix: 'ship_',
                start: 1,
                end: 6
            })
        })

        // add rocket (p1)
        this.p1Rocket = new Rocket(this, game.config.width/2, game.config.height - borderUISize - borderPadding, 'rocket').setOrigin(0.5, 0);
        
        // overlay tile sprite
        this.spacedust = this.add.tileSprite(0, 0, 640, 480, 'dust').setOrigin(0, 0);

        // green UI background
        this.add.rectangle(0, borderUISize + borderPadding, game.config.width, borderUISize * 2, 0x00FF00).setOrigin(0, 0);
        // white borders
        this.add.rectangle(0, 0, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(0, game.config.height - borderUISize, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(0, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(game.config.width - borderUISize, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0);

        // background music (WIP)
        let music = this.sound.add('bgm_normal');
        music.play();

        // define keys
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keyM = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.M);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);

        // explode animation config
        this.anims.create({
            key: 'explode',
            frames: this.anims.generateFrameNumbers('explosion', { start: 0, end: 9, first: 0}),
            frameRate: 30
        });

        // initialize score
        this.p1Score = 0;
        // display score
        let scoreConfig = {
            fontFamily: 'Courier',
            fontSize: '25px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'left',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 180
        }
        this.scoreLeft = this.add.text(borderUISize + borderPadding, borderUISize + borderPadding*2, 'SCORE:' + this.p1Score, scoreConfig);
        // displays high score
        this.scoreRight = this.add.text(game.config.width - (game.config.width/3 + borderPadding), borderUISize + borderPadding*2, 'HIGH:' + highScore, scoreConfig);

        // GAME OVER flag
        this.gameOver = false;
        
        // 60-second play clock
        scoreConfig.fixedWidth = 0;
        this.clock = this.time.delayedCall(game.settings.gameTimer, () => {
            this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', scoreConfig).setOrigin(0.5);
            this.add.text(game.config.width/2, game.config.height/2 + 64, 'Press (R) to Restart or (M) for Menu', scoreConfig).setOrigin(0.5);
            music.stop();
            this.gameOver = true;
        }, null, this);
        // display timer
        this.timeCenter = this.add.text(game.config.width - (game.config.width/2 + borderPadding*5 + borderPadding/3), borderUISize + borderPadding*2, 'TIME:' + this.clock.getRemainingSeconds().toFixed(0), scoreConfig);

        // 30-second speedup clock
        this.clock2 = this.time.delayedCall(game.settings.speedTimer, () => {
            this.ship01.moveSpeed += 2;
            this.ship02.moveSpeed += 2;
            this.ship03.moveSpeed += 2;
            this.alien.moveSpeed += 2;
        }, null, this);

        // fire text configuration
        let fireConfig = {
            fontFamily: 'Courier',
            fontSize: '25px',
            color: '#000000',
            align: 'right',
            stroke: '#000000',
            strokeThickness: 1,
            padding: {
                top: 5,
                bottom: 5
            },
            fixedWidth: 0
        }
        this.fireText = this.add.text(game.config.width - (game.config.width/2 + borderPadding*5 + borderPadding/5), borderUISize - borderPadding*3, '', fireConfig);

        // particle configuration
        this.emitter = this.add.particles(0, 0, 'splode', {
            speed: 24,
            lifespan: 1500,
            quantity: 10,
            scale: { start: 1, end: 0 },
            emitting: false,
            duration: 500
        });
    }

    update() {
        // check key input for restart
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyR)) {
            this.scene.restart();
        }
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyM)) {
            this.scene.start("menuScene");
        }
        
        this.starfield.tilePositionX -= 1;
        this.debris.tilePositionX -= 3;
        this.spacedust.tilePositionX -= 4;
        if (!this.gameOver) {
            this.p1Rocket.update();     // update rocket sprite
            this.ship01.update();       // update spaceships (x3)
            this.ship02.update();
            this.ship03.update();
            this.alien.update();
        }
        // spaceship enemy animations
        this.alien.play('run', true);
        this.ship01.play('fly', true);
        this.ship02.play('fly', true);
        this.ship03.play('fly', true);

        if(this.p1Rocket.isFiring) {
            this.showFire();
        }
        if(!(this.p1Rocket.isFiring)) {
            this.fireGone();
        }

        // check collisions
        if(this.checkCollision(this.p1Rocket, this.ship03)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship03);
        }
        if (this.checkCollision(this.p1Rocket, this.ship02)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship02);
        }
        if (this.checkCollision(this.p1Rocket, this.ship01)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship01);
        }
        if (this.checkCollision(this.p1Rocket, this.alien)) {
            this.p1Rocket.reset();
            this.shipExplode(this.alien);
        }

        // update timer text
        this.timeCenter.text = 'TIME:' + this.clock.getRemainingSeconds().toFixed(0);
    }

    checkCollision(rocket, ship) {
        // simple AABB checking
        if (rocket.x < ship.x + ship.width && rocket.x + rocket.width > ship.x && rocket.y < ship.y + ship.height && rocket.height + rocket.y > ship.y) {
            return true;
        } else {
            return false;
        }
    }

    shipExplode(ship) {
        // temporarily hide ship
        ship.alpha = 0;
        // create explosion sprite at ship's position
        if(ship.points >= 50) {
            let boom = this.add.sprite(ship.x, ship.y, 'alien').setOrigin(0, 0);
            this.emitter.explode(10, (ship.x + 20), (ship.y + 20));
            boom.anims.play('death');
            boom.on('animationcomplete', () => {    // callback after anim completes
                ship.reset();                       // reset ship position
                ship.alpha = 1;                     // make ship visible again
                boom.destroy();                     // remove explosion sprite
            });
            // play scream sound
            this.sound.play('sfx_scream');
        }
        else {
            let boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0, 0);
            this.emitter.explode(10, (ship.x + 30), (ship.y + 20));
            boom.anims.play('explode');             // play explode animation
            boom.on('animationcomplete', () => {    // callback after anim completes
                ship.reset();                       // reset ship position
                ship.alpha = 1;                     // make ship visible again
                boom.destroy();                     // remove explosion sprite
            });
        }
        // score add and repaint
        this.p1Score += ship.points;
        this.scoreLeft.text = 'SCORE:' + this.p1Score;
        
        // updates high score
        if (this.p1Score > highScore) {
            highScore = this.p1Score;
            this.scoreRight.text = 'HIGH:' + highScore;
        }
        
        // play explosion sound
        this.sound.play('sfx_explosion');
    }

    // shows fire text
    showFire() {
        this.fireText.text = 'F I R E';
    }
    fireGone() {
        this.fireText.text = '';
    }
}