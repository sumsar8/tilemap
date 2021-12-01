/*class PlayScene extends Phaser.Scene {
    constructor() {
        super("PlayScene");
    }
    create() {
        // variabel för att hålla koll på hur många gånger vi spikat oss själva
        this.spiked = 0;
        // ladda spelets bakgrundsbild, statisk
        // setOrigin behöver användas för att den ska ritas från top left
         this.add.image(0, 0, "Background").setOrigin(0, 0);

        // skapa en tilemap från JSON filen vi preloadade
        const map = this.make.tilemap({ key: "map" });
        // ladda in tilesetbilden till vår tilemap
        const tileset = map.addTilesetImage("platforms", "platforms");

        // initiera animationer, detta är flyttat till en egen metod
        // för att göra create metoden mindre rörig
        this.initAnims();

        // keyboard cursors
        this.cursors = this.input.keyboard.createCursorKeys();
        this.spacekey = this.input.keyboard.addKey("SPACE"); // Get key object
        this.upkey = this.input.keyboard.addKey("a"); // Get key object

        // Ladda lagret Platforms från tilemappen
        // och skapa dessa
        // sätt collisionen
        map.createLayer("Background", tileset);
        map.createLayer("Mountains", tileset);

        //this.spikes = map.createLayer("Spikes", tileset);
        //this.spikes.setCollisionByExclusion(-1, true);
        this.platforms = map.createLayer("Platform", tileset);
        this.platforms.setCollisionByExclusion(-1, true);
        this.platforms.setCollisionByProperty({ collides: true });
        this.platforms.setCollisionFromCollisionGroup(
             true,
             true,
             this.platforms
         );
         this.platforms.setCollision(1, true, true);

        // skapa en spelare och ge den studs
        this.player = this.physics.add.sprite(50, 300, "player");
        this.player.setBounce(0.1);
        this.player.setCollideWorldBounds(true);

        // skapa en fysik-grupp
        /*this.spikes = this.physics.add.group({
            allowGravity: false,
            immovable: true,
        });

        // från platforms som skapats från tilemappen
        // kan vi ladda in andra lager
        // i tilemappen finns det ett lager Spikes
        // som innehåller spikarnas position
        console.log(this.platforms);
        map.getObjectLayer("Spikes").objects.forEach((spike) => {
            // iterera över spikarna, skapa spelobjekt
            const spikeSprite = this.spikes
                .create(spike.x, spike.y - spike.height, "spike")
                .setOrigin(0);
            spikeSprite.body
                .setSize(spike.width, spike.height - 20)
                .setOffset(0, 20);
        });
        // lägg till en collider mellan spelare och spik
        // om en kollision sker, kör callback metoden playerHit*/
        /*this.physics.add.collider(
            this.player,
            //this.spikes,
            this.playerHit,
            null,
            this
        );

        // krocka med platforms lagret
        this.physics.add.collider(this.player, this.platforms);

        // skapa text på spelet, texten är tom
        // textens innehåll sätts med updateText() metoden
        this.text = this.add.text(16, 16, "", {
            fontSize: "20px",
            fill: "#ffffff",
        });
        this.text.setScrollFactor(0);
        this.updateText();

        // lägg till en keyboard input för W
        this.keyObj = this.input.keyboard.addKey("W", true, false);

        // exempel för att lyssna på events
        this.events.on("pause", function () {
            console.log("Play scene paused");
        });
        this.events.on("resume", function () {
            console.log("Play scene resumed");
        });
    }

    // play scenens update metod
    update() {
        // för pause
        if (this.keyObj.isDown) {
            // pausa nuvarande scen
            this.scene.pause();
            // starta menyscenene
            this.scene.launch("MenuScene");
        }

        // följande kod är från det tutorial ni gjort tidigare
        // Control the player with left or right keys

        if(this.upkey.isDown){
            this.player.setVelocityY(5000);
        }

        if (this.spacekey.isUp) {
            allowjump = true;
        }
        if (this.spacekey.isDown && allowjump) {
            for (let i = 0; i < 10; i++) {
                let a = 0;
                const ski = setInterval(() => {
                    this.player.setVelocityX(500);
                    a++;
                    if (a == 9) {
                        clearInterval(ski);
                    }
                }, 10);
            }

            console.log("asd");
            if (this.player.body.onFloor()) {
                this.player.play("walk", true);
            }

            allowjump = false;
        } else {
            this.player.setVelocityX(0);
            if (this.player.body.onFloor()) {
                this.player.play("idle", true);
            }
        }
        if (this.cursors.left.isDown) {
            if (this.player.body.onFloor()) {
                this.player.play("walk", true);
            }
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(200);
            console.log("asd");

            if (this.player.body.onFloor()) {
                this.player.play("walk", true);
            }
        } else {
            // If no keys are pressed, the player keeps still
            // Only show the idle animation if the player is footed
            // If this is not included, the player would look idle while jumping
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
            `Arrow keys to move. Space to jump. W to pause. Spiked: ${this.spiked}`
        );
    }

    // när spelaren landar på en spik, då körs följande metod
    playerHit(player, spike) {
        this.spiked++;
        player.setVelocity(0, 0);
        player.setX(50);
        player.setY(300);
        player.play("idle", true);
        let tw = this.tweens.add({
            targets: player,
            alpha: { start: 0, to: 1 },
            tint: { start: 0xff0000, to: 0xffffff },
            duration: 100,
            ease: "Linear",
            repeat: 5,
        });
        this.updateText();
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
var allowjump = true;

export default PlayScene;
*/

class PlayScene extends Phaser.Scene {
    constructor() {
        super('PlayScene');
    }

    create() {
        this.allowski = true;

        //Player Stats
        this.maxspeed = 200;
        this.friction = 0.8;
        this.pushspeed = 1000;
        this.velocity = 0;

        // variabel för att hålla koll på hur många gånger vi spikat oss själva
        this.spiked = 0;

        // ladda spelets bakgrundsbild, statisk
        // setOrigin behöver användas för att den ska ritas från top left
        this.add.image(0, 0, 'background').setOrigin(0, 0);

        // skapa en tilemap från JSON filen vi preloadade
        const map = this.make.tilemap({ key: 'map' });
        // ladda in tilesetbilden till vår tilemap
        const tileset = map.addTilesetImage('platforms', 'platforms');

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
        this.player = this.physics.add.sprite(670, 540, 'player');
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
        this.text = this.add.text(16, 16, '', {
            fontSize: '20px',
            fill: '#ffffff'
        });
        this.text.setScrollFactor(0);
        this.updateText();

        // lägg till en keyboard input för W
        this.keyObj = this.input.keyboard.addKey('W', true, false);

        // exempel för att lyssna på events
        this.events.on('pause', function () {
            console.log('Play scene paused');
        });
        this.events.on('resume', function () {
            console.log('Play scene resumed');
        });
            
}
    // play scenens update metod
    update() {

        // för pause
        if (this.keyObj.isDown) {
            // pausa nuvarande scen
            this.scene.pause();
            // starta menyscenene
            this.scene.launch('MenuScene');
        }
        //Kamera
        if(this.player.x > 657 && this.player.x < 2543){
            this.cameras.main.x = -this.player.x + 657;

        }

        if (this.cursors.space.isDown && this.allowski && this.player.body.onFloor()){
                this.allowski = false;
                this.velocity += (this.pushspeed);
        }
        if(this.cursors.space.isUp){
            this.allowski = true;
        }
        this.velocity = this.friction * this.velocity;

        this.player.setVelocityX(this.velocity);
        












        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-200);
            if (this.player.body.onFloor()) {
                this.player.play('walk', true);
            }
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(200);
            if (this.player.body.onFloor()) {
                this.player.play('walk', true);
            }
        } 
            // Only show the idle animation if the player is footed
            // If this is not included, the player would look idle while jumping
            if (this.player.body.onFloor()) {
                this.player.play('idle', true);
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
            `Arrow keys to move. Space to jump. W to pause. Spiked: ${this.spiked}`
        );
    }

    // när spelaren landar på en spik, då körs följande metod
    playerHit(player, spike) {
        this.spiked++;
        player.setVelocity(0, 0);
        player.setX(50);
        player.setY(300);
        player.play('idle', true);
        let tw = this.tweens.add({
            targets: player,
            alpha: { start: 0, to: 1 },
            tint: { start: 0xff0000, to: 0xffffff },
            duration: 100,
            ease: 'Linear',
            repeat: 5
        });
        this.updateText();
    }

    // när vi skapar scenen så körs initAnims för att ladda spelarens animationer
    initAnims() {
        this.anims.create({
            key: 'walk',
            frames: this.anims.generateFrameNames('player', {
                prefix: 'jefrens_',
                start: 1,
                end: 4
            }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'idle',
            frames: [{ key: 'player', frame: 'jefrens_2' }],
            frameRate: 10
        });

        this.anims.create({
            key: 'jump',
            frames: [{ key: 'player', frame: 'jefrens_5' }],
            frameRate: 10
        });
    }
}

export default PlayScene;