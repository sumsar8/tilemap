class ButikScene extends Phaser.Scene {
    constructor() {
        super('ButikScene');
    }

    create() {
        // Det går att göra så att input lyssnar på spelet
        // nu är det på scenen, därför behöver vi skapa input igen
        this.keyObj = this.input.keyboard.addKey('W', true, false);

        // spelets config om vi behöver något från den, som width height
        // console.log(this.game.config)
        // skapa texten för PAUSED
        // använder en font som laddats i base.njk från Google fonts
        // fixedW/H används för  att kunna centrera texten på skärmen
        this.text = this.add.text(0, (this.game.config.height / 2) - 64, 'Butik', {
            fontFamily: '"Mochiy Pop P One"',
            fontSize: '64px',
            fill: '#ff0000',
            align: 'center',
            fixedWidth: this.game.config.width,
            fixedHeight: this.game.config.height,
        });
        this.object = this.add.rectangle(600, 300, 1000, 500, 0xff1100);

    }

    // scenens uppdate metod, lyssnar på keyDown
    update() {
        if (this.keyObj.isDown) {
            // resumera spelscenen
            this.scene.resume('PlayScene');
            // göm denna scen
            this.scene.setVisible(false);
        }
    }
}

export default ButikScene;
