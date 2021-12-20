class PlayScene extends Phaser.Scene {
    constructor() {
        super("PlayScene");
    }

    updateCounter() {
        this.velocity = this.friction * this.velocity;
        if (this.outside == true) {
            if (this.coldlevel > 0) {
                this.coldlevel -= this.temperature - this.coldresistance;
            }
        } else {
            this.coldlevel = 300;
        }

        this.updateText();
    }

    create() {
        this.timedEvent = this.time.addEvent({
            delay: 100,
            callback: this.updateCounter,
            callbackScope: this,
            loop: true
        });

        this.allowski = true;

        //Player Stats
        this.maxspeed = 500;
        this.friction = 0.9;
        this.pushspeed = 100;
        this.velocity = 0;

        this.coldlevel = 300;
        this.coldresistance = 1;
        this.temperature = 10;
        this.outside = false;
        this.balance = 0;
        this.laps = 0;
        // variabel för att hålla koll på hur många gånger vi spikat oss själva
        this.spiked = 0;

        // ladda spelets bakgrundsbild, statisk
        // setOrigin behöver användas för att den ska ritas från top left
        this.add.image(0, 0, "background").setOrigin(0, 0);

        // skapa en tilemap från JSON filen vi preloadade
        const map = this.make.tilemap({ key: "map" });
        // ladda in tilesetbilden till vår tilemap
        const tileset = map.addTilesetImage("wintertileset64x64", "platforms");

        // initiera animationer, detta är flyttat till en egen metod
        // för att göra create metoden mindre rörig
        this.initAnims();

        // keyboard cursors
        this.cursors = this.input.keyboard.createCursorKeys();

        // Ladda lagret Platforms från tilemappen
        // och skapa dessa
        // sätt collisionen
        map.createLayer("Ice", tileset);
        map.createLayer("Background", tileset);
        map.createLayer("Shop", tileset);
        this.namntext = this.add.text(1150, 220, "Rasmus Öberg TE19", {
            fontSize: "12px",
            fill: "#ffffff"
        });
        this.coldbar = this.add.rectangle(
            110,
            235,
            this.coldlevel,
            30,
            0xff3300
        );

        this.platforms = map.createLayer("Platforms", tileset);
        this.platforms.setCollisionByExclusion(-1, true);

        this.player = this.physics.add.sprite(670, 540, "player");

        this.player.setBounce(0.1);
        this.player.setCollideWorldBounds(true);

        this.shop = this.add.sprite(224, 672, "shop");

        console.log(this.platforms);
        this.physics.add.collider(this.player, this.platforms);

        this.keyObj = this.input.keyboard.addKey("W", true, false);

        this.events.on("pause", function () {
            console.log("Butikscene aktiv");
        });
        this.events.on("resume", function () {
            console.log("Butikscene av");
        });

        this.text = this.add.text(16, 16, "", {
            fontSize: "20px",
            fill: "#ffffff"
        });
    }

    // play scenens update metod
    update() {
        if (this.player.x > 10000) {
            this.player.x = 5000;
            this.laps++;
            if (this.laps == 5) {
                this.player.x = 0;
            }
        }
        if (this.player.x > 800) {
            this.outside = true;
        } else {
            this.outside = false;
        }
        //Checka om död
        if (this.coldlevel < 0) {
            this.velocity = 0;
            if (this.player.x > 800) {
                this.player.x -= 10;
            }
            if (this.player.x < 800) {
                this.coldlevel = 300;
            }
        }

        //Butik
        if (this.player.x < 335) {
            if (this.keyObj.isDown) {
                // pausa nuvarande scen
                this.scene.pause();
                // starta menyscenene
                this.scene.launch("ButikScene");
            }
        }

        //Kamera och text
        if (this.player.x > 657 && this.player.x < 2543) {
            this.cameras.main.x = -this.player.x + 657;
            this.cameras.main.y = -200;
            this.text.x = this.player.x - 650;
        }

        //coldbar
        if (this.player.x > 657 && this.player.x < 2543) {
            this.coldbar.x = this.player.x - 485;
        }
        this.coldbar.width = this.coldlevel;

        if (this.coldlevel < 0) {
            this.coldbar.width = 0;
        }

        if (this.velocity < this.maxspeed) {
            if (
                this.cursors.space.isDown &&
                this.allowski &&
                this.player.body.onFloor()
            ) {
                this.allowski = false;
                this.velocity += this.pushspeed;
                this.player.play("walk", true);
            }
            if (this.cursors.space.isUp) {
                this.allowski = true;
            }
        }

        this.player.setVelocityX(this.velocity);

        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-200);
            if (this.player.body.onFloor()) {
                this.player.play("walk", true);
            }
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(200);
            if (this.player.body.onFloor()) {
                this.player.play("walk", true);
            }
        }
        if (this.player.body.onFloor()) {
            this.player.play("idle", true);
        }
        this.shop.play("vendoridle", true);

        if (this.player.body.velocity.x > 0) {
            this.player.setFlipX(false);
        } else if (this.player.body.velocity.x < 0) {
            this.player.setFlipX(true);
        }
    }

    updateText() {
        this.text.setText(
            `Velocity: ${Math.round(this.velocity)} Cold: ${this.coldlevel}`
        );
    }

    // när vi skapar scenen så körs initAnims för att ladda spelarens animationer
    initAnims() {
        this.anims.create({
            key: "walk",
            frames: this.anims.generateFrameNames("player", {
                start: 1,
                end: 30,
                zeroPad: 2,
                prefix: "slide"
            }),
            frameRate: 20,
            repeat: 1
        });
        this.anims.create({
            key: "idle",
            frames: this.anims.generateFrameNames("player", {
                start: 1,
                end: 7,
                zeroPad: 2,
                prefix: "idle"
            }),
            frameRate: 7,
            repeat: 1
        });
        this.anims.create({
            key: "vendoridle",
            frames: this.anims.generateFrameNames("shop", {
                prefix: "vendor0",
                start: 1,
                end: 6,
                zeropad: 2
            }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: "jump",
            frames: [{ key: "player", frame: "jefrens_5" }],
            frameRate: 10
        });
    }
}

export default PlayScene;
