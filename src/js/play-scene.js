class PlayScene extends Phaser.Scene {
    constructor() {
        super("PlayScene");
    }

    updateCounter() {
        this.velocity = this.friction * this.velocity;
        if (this.outside == true) {
            this.coldlevel -= this.temperature - this.coldresistance;
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
            loop: true,
        });

        this.allowski = true;

        //Player Stats
        this.maxspeed = 500;
        this.friction = 0.9;
        this.pushspeed = 100;
        this.velocity = 0;

        this.coldlevel = 300;
        this.coldresistance = 10;
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
        const tileset = map.addTilesetImage("platforms", "platforms");

        // initiera animationer, detta är flyttat till en egen metod
        // för att göra create metoden mindre rörig
        this.initAnims();

        // keyboard cursors
        this.cursors = this.input.keyboard.createCursorKeys();

        // Ladda lagret Platforms från tilemappen
        // och skapa dessa
        // sätt collisionen
        map.createLayer("Background", tileset);
        map.createLayer("Mountains", tileset);
        this.object = this.add.rectangle(800, 550, 30, 100, 0xff3300);
        //Butik
        this.object = this.add.rectangle(110, 550, 300, 100, 0xff3300);

        this.platforms = map.createLayer("Platforms", tileset);
        this.platforms.setCollisionByExclusion(-1, true);
        // platforms.setCollisionByProperty({ collides: true });
        // this.platforms.setCollisionFromCollisionGroup(
        //     true,
        //     true,
        //     this.platforms
        // );
        // platforms.setCollision(1, true, true);

        // skapa en spelare och ge den studs
        this.player = this.physics.add.sprite(670, 540, "player");
        this.player.setBounce(0.1);
        this.player.setCollideWorldBounds(true);

        // skapa en fysik-grupp
        /*this.spikes = this.physics.add.group({
            allowGravity: false,
            immovable: true
        });
*/
        // från platforms som skapats från tilemappen
        // kan vi ladda in andra lager
        // i tilemappen finns det ett lager Spikes
        // som innehåller spikarnas position
        console.log(this.platforms);
        /*map.getObjectLayer('Spikes').objects.forEach((spike) => {
            // iterera över spikarna, skapa spelobjekt
            const spikeSprite = this.spikes
                .create(spike.x, spike.y - spike.height, 'spike')
                .setOrigin(0);
            spikeSprite.body
                .setSize(spike.width, spike.height - 20)
                .setOffset(0, 20);
        });
        // lägg till en collider mellan spelare och spik
        // om en kollision sker, kör callback metoden playerHit
        this.physics.add.collider(
            this.player,
            this.spikes,
            this.playerHit,
            null,
            this
        );
*/
        // krocka med platforms lagret
        this.physics.add.collider(this.player, this.platforms);

        // skapa text på spelet, texten är tom
        // textens innehåll sätts med updateText() metoden

        // lägg till en keyboard input för W
        this.keyObj = this.input.keyboard.addKey("W", true, false);

        // exempel för att lyssna på events
        this.events.on("pause", function () {
            console.log("Butikscene aktiv");
        });
        this.events.on("resume", function () {
            console.log("Butikscene av");
        });

        this.text = this.add.text(16, 16, "", {
            fontSize: "20px",
            fill: "#ffffff",
        });
        this.text.setScrollFactor(0);
    }

    // play scenens update metod
    update() {
        if (this.player.x > 2048) {
            this.player.x = 1720;
            this.laps++;
            if (this.laps == 5) {
                this.player.x = 100;
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

        // för pause
        //Butik
        if (this.player.x < 280) {
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
            this.text.x = this.player.x - 650;
        }
        if (this.velocity < this.maxspeed) {
            if (
                this.cursors.space.isDown &&
                this.allowski &&
                this.player.body.onFloor()
            ) {
                this.allowski = false;
                this.velocity += this.pushspeed;
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
        // Only show the idle animation if the player is footed
        // If this is not included, the player would look idle while jumping
        if (this.player.body.onFloor()) {
            this.player.play("idle", true);
        }

        // Player can jump while walking any direction by pressing the space bar
        // or the 'UP' arrow

        if (this.player.body.velocity.x > 0) {
            this.player.setFlipX(false);
        } else if (this.player.body.velocity.x < 0) {
            // otherwise, make them face the other side
            this.player.setFlipX(true);
        }
    }

    // metoden updateText för att uppdatera overlaytexten i spelet
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
                prefix: "jefrens_",
                start: 1,
                end: 4,
            }),
            frameRate: 10,
            repeat: -1,
        });

        this.anims.create({
            key: "idle",
            frames: [{ key: "player", frame: "jefrens_2" }],
            frameRate: 10,
        });

        this.anims.create({
            key: "jump",
            frames: [{ key: "player", frame: "jefrens_5" }],
            frameRate: 10,
        });
    }
}

export default PlayScene;
