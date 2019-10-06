class CreditsScene extends Phaser.Scene {
	runtime: number = 0;
	stars: Star[] = [];

	constructor() {
		super({key: "CreditsScene"});
	}

	preload(): void {
		this.load.spritesheet("player", "res/player.png", {frameWidth: 16, frameHeight: 16});
		this.load.spritesheet("pudding_dog", "res/pudding_dog.png", {frameWidth: 16, frameHeight: 16});
		this.load.spritesheet("star", "res/star.png", {frameWidth: 8, frameHeight: 8, startFrame: 0, endFrame: 16});
	}

	create(): void {
		this.cameras.main.setBackgroundColor("#fff");
		this.cameras.main.setScroll(0, 0);

		this.anims.create({
	    key: 'run',
	    frames: this.anims.generateFrameNumbers('player', {start: 0, end: 4}),
	    frameRate: 5,
	    repeat: -1
		});
		this.anims.create({
	    key: 'p_run',
	    frames: this.anims.generateFrameNumbers('pudding_dog', {start: 0, end: 4}),
	    frameRate: 5,
	    repeat: -1
		});
		this.anims.create({
	    key: 'p_idle',
	    frames: [{key: "pudding_dog", frame: 0}, {key: "pudding_dog", frame: 5}, {key: "pudding_dog", frame: 6}],
	    frameRate: 2,
	    repeat: -1
		});

		for (let i = 0; i < 200; i++) {
			let x = Math.round(Math.random() * (this.cameras.main.width / 4));
			let y = Math.round(Math.random() * (this.cameras.main.height / 4));
			this.stars.push(new Star(this, x, y));
			this.stars[this.stars.length - 1].fadeIn();
		}

		let midX = this.cameras.main.width/2;
		let midY = this.cameras.main.height / 2;
		
		this.add.text(midX - 220, 160, "Yogurt's Quest", {fontFamily: '"Roboto Bold", "Roboto", "Calibri"', fontSize: "64px"});
		this.add.text(midX - 75, 306, "- Starring -", {fontStyle: 'Italic', fontFamily: '"Roboto Italic", "Roboto", "Calibri"', fontSize: "32px"});
		let yogurt = this.add.sprite(midX - 200, 370, "player", 0);
		yogurt.anims.play('run');
		yogurt.setScale(4, 4);
		let pudding = this.add.sprite(midX + 200, 370, "player", 0);
		pudding.anims.play('p_idle');
		pudding.setScale(-4, 4);
		this.add.text(midX - 150, 360, "Yogurt", {fontFamily: '"Roboto Bold", "Roboto", "Calibiri"', fontSize: "24px"});
		this.add.text(midX + 60, 360, "Pudding", {fontFamily: '"Roboto Bold", "Roboto", "Calibiri"', fontSize: "24px"});
		this.add.text(midX - 10, 360, "&", {fontFamily: '"Roboto Bold", "Roboto", "Calibiri"', fontSize: "24px"});
		this.add.text(midX - 280, 460, "Created by Nicole Collings\nFor Ludum Dare 45.", {fontFamily: '"Roboto Bold", "Roboto", "Calibri"', fontSize: "48px"});
		this.add.text(midX - 280, 580, "I hope you enjoyed playing!~", {fontFamily: '"Roboto Bold", "Roboto", "Calibri"', fontSize: "24px"});
	}

	update(): void {
		if (this.runtime < 90) {
	    let hexColor = Phaser.Display.Color.Interpolate.ColorWithColor(new Phaser.Display.Color(255,255,255), new Phaser.Display.Color(212, 59, 126), 90, this.runtime);
			this.cameras.main.setBackgroundColor(hexColor);
		}
		this.runtime++;

		for (let star of this.stars) {
			star.push(0, -0.1);
			star.stayOnScreen();
		}
	}
}
