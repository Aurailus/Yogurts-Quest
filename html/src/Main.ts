/// <reference path="../@types/phaser.d.ts"/>

let game;
window.onload = () => {
	game = new LD45({
		title: "LD45",
		width: 1,
		height: 1,
		parent: "game",
		backgroundColor: "#000000",
		antialias: false,
		// scene: [IntroScene, MainScene, CreditsScene],
		// scene: [MainScene, IntroScene, CreditsScene],
		scene: [MainScene, CreditsScene, IntroScene],
		physics: {
			default: "arcade",
			arcade: {
				debug: false
			}
		}
	});
}

class LD45 extends Phaser.Game {
	constructor(config: GameConfig) {
		let frame = document.getElementById("game");
		config.width = frame.offsetWidth;
		config.height = frame.offsetHeight;
		super(config);
	}
}
