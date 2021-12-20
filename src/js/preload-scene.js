class PreloadScene extends Phaser.Scene {
    constructor() {
        super("PreloadScene");
    }

    preload() {
        // säg åt phaser att lägga till /assets i alla paths
        this.load.setBaseURL("/assets");
        this.load.atlas(
            "player",
            "/images/penguinAnimation.png",
            "/images/penguinAnimation.json"
        );
        this.load.atlas(
            "shop",
            "/images/shopAnimation.png",
            "/images/shopAnimation.json"
        );
        this.load.image("platforms", "/tilesets/wintertileset64x64.png");
        // här laddar vi in en tilemap med spelets "karta"
        this.load.tilemapTiledJSON("map", "/tilemaps/finalmap1.json");
    }

    create() {
        this.scene.start("PlayScene");
    }
}

export default PreloadScene;
