// importera alla scener
import PlayScene from "./play-scene";
import PreloadScene from "./preload-scene";
import ButikScene from "./butik-scene";

// spelets config
const config = {
    type: Phaser.AUTO,
    width: 3200,
    height: innerHeight,
    pixelArt: true,
    transparent: true,
    physics: {
        default: "arcade",
        arcade: {
            gravity: { y: 400 },
            debug: true,
        },
    },
    scene: [PreloadScene, PlayScene, ButikScene],
    parent: "game",
};

// initiera spelet
new Phaser.Game(config);
