import { add } from "@11ty/eleventy/src/TemplateCache";

class ButikScene extends Phaser.Scene {
    constructor() {
        super("ButikScene");
    }

    create() {
        this.pointerdown = false;

        this.keyObj = this.input.keyboard.addKey("W", true, false);
        this.group = this.add.group();

        this.text = this.add.text(
            0,
            this.game.config.height / 2 - 64,
            "Butik",
            {
                fontFamily: '"Mochiy Pop P One"',
                fontSize: "64px",
                fill: "#ff0000",
                align: "center",
                fixedWidth: this.game.config.width,
                fixedHeight: this.game.config.height
            }
        );
        this.object = this.add.rectangle(600, 300, 1000, 500, 0xff1100);
        this.button1 = this.add
            .rectangle(200, 150, 80, 80, 0x0b0402)
            .setInteractive();
        this.button2 = this.add.rectangle(200, 250, 80, 80, 0x0b0402);
        this.button3 = this.add.rectangle(200, 350, 80, 80, 0x0b0402);
        this.button4 = this.add.rectangle(200, 450, 80, 80, 0x0b0402);
    }
    test() {
        console.log("test");
    }
    update() {
        if (this.keyObj.isDown) {
            this.scene.resume("PlayScene");
            this.scene.setVisible(false);
        }

        this.button1.on("pointerdown", this.test());
    }
}

export default ButikScene;
