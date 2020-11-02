class MainScene extends Phaser.Scene {
	runtime: number = 0;
	stars: Star[] = [];
	player: Player;
	groundBits: Ground[] = [];

	jumpKey: Phaser.Input.Keyboard.Key;
	leftKey: Phaser.Input.Keyboard.Key;
	rightKey: Phaser.Input.Keyboard.Key;

	screenOff: number = 0;
	cameraY: number = 0;
	bitsCollected: number = 0;
	shardsCollected: number = 0;

	controllingPlayer: boolean;
	chillStars: boolean = false;
	cameraMove: boolean = true;

	keyboardIndicator: Phaser.GameObjects.Sprite;

	constructor() {
		super({key: "MainScene"});
	}

	preload(): void {
		this.cameras.main.setBackgroundColor("#fff");
		this.load.spritesheet("player", "res/player.png", {frameWidth: 16, frameHeight: 16});
		this.load.spritesheet("pudding_dog", "res/pudding_dog.png", {frameWidth: 16, frameHeight: 16});
		this.load.spritesheet("star", "res/star.png", {frameWidth: 8, frameHeight: 8, startFrame: 0, endFrame: 16});
		this.load.spritesheet("pickup_2", "res/pickup_2.png", {frameWidth: 8, frameHeight: 8, startFrame: 0, endFrame: 16});
		this.load.spritesheet("pudding", "res/pudding.png", {frameWidth: 16, frameHeight: 16, startFrame: 0, endFrame: 64});
		this.load.image("keyboard_indicator", "res/keyboard_indicator.png");
		this.load.image("glow", "res/glow.png");

		this.load.image("ground_0", "res/ground_0.png");
		this.load.image("terrain_map_0", "res/terrain_map_0.png");

		this.load.image("ground_1", "res/ground_1.png");
		this.load.image("terrain_map_1", "res/terrain_map_1.png");

		this.load.image("ground_2", "res/ground_2.png");
		this.load.image("terrain_map_2", "res/terrain_map_2.png");

		this.load.image("ground_3", "res/ground_3.png");
		this.load.image("terrain_map_3", "res/terrain_map_3.png");

		this.load.image("ground_4", "res/ground_4.png");
		this.load.image("terrain_map_4", "res/terrain_map_4.png");

		this.load.image("ground_5", "res/ground_5.png");
		this.load.image("terrain_map_5", "res/terrain_map_5.png");

		this.load.image("ground_6", "res/ground_6.png");
		this.load.image("terrain_map_6", "res/terrain_map_6.png");

		this.load.image("ground_7", "res/ground_7.png");
		this.load.image("terrain_map_7", "res/terrain_map_7.png");

		this.load.image("ground_9", "res/ground_9.png");
		this.load.image("terrain_map_9", "res/terrain_map_9.png");

		this.load.image("ground_10", "res/ground_10.png");
		this.load.image("terrain_map_10", "res/terrain_map_10.png");

		this.load.image("ground_11", "res/ground_11.png");
		this.load.image("terrain_map_11", "res/terrain_map_11.png");
		this.load.image("ground_11_door", "res/ground_11_door.png");
		this.load.image("terrain_map_11_door", "res/terrain_map_11_door.png");
		this.load.image("ground_big", "res/ground_big.png");
	}

	create(): void {
		//@ts-ignore
		$("#game").removeClass('active');

		this.leftKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
		this.rightKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
		this.jumpKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

		this.runtime = 0;
		this.stars = [];
		this.player = null;
		this.groundBits = [];
		this.screenOff = 0;
		this.cameraY = 0;
		this.bitsCollected = 0;
		this.shardsCollected = 0;
		this.controllingPlayer = true;

		for (let i = 0; i < 200; i++) {
			let x = Math.round(Math.random() * (this.cameras.main.width / 4));
			let y = Math.round(Math.random() * (this.cameras.main.height / 4));
			this.stars.push(new Star(this, x, y));
			this.stars[this.stars.length - 1].fadeReg();
		}

		this.cameraY = -600;


		this.player = new Player(this, 0, 0, this.groundBits);
		this.groundBits.push(new Ground(this, -56, -49, 0));
		new GroundMaker(this, 60, -20);
		this.keyboardIndicator = this.add.sprite(30, -90, "keyboard_indicator", 0);
		this.keyboardIndicator.setScale(4, 4);
	}

	update(time: number, delta: number): void {
		if (this.runtime < 30) {
	    let hexColor = Phaser.Display.Color.Interpolate.ColorWithColor(new Phaser.Display.Color(255,255,255), new Phaser.Display.Color(15, 11, 31), 30, this.runtime);
			this.cameras.main.setBackgroundColor(hexColor);
		}
		this.runtime++;

		this.keyboardIndicator.setAlpha(0.4 + Math.sin(this.runtime / 50) * 0.2);

		for (let star of this.stars) {
			if (!this.chillStars) star.push(-1, -1);
			else star.push(0, 0.1);
			star.stayOnScreen();
		}
		
		if (!this.chillStars) this.screenOff += 0.025;

		if (this.controllingPlayer) {
			if (this.leftKey.isDown) {
				this.player.moveLeft();
			}
			if (this.rightKey.isDown) {
				this.player.moveRight();
			}
			if (this.jumpKey.isDown) {
				this.player.jump();
			}
		}

		this.groundBits[0].collidesAt(this.player.x, this.player.y)

		if (this.cameraMove) {
			this.cameras.main.scrollX = this.player.x - this.cameras.main.width / 2 + this.player.width / 2;
			this.cameras.main.scrollY = Math.round(this.cameraY / 4 + Math.sin(this.screenOff)*2) * 4;
		}

		if (this.player.collides(this.player.rawX, this.player.rawY + 1)) {
			this.cameraY = this.cameraY * 0.95 + (this.player.y - this.cameras.main.height / 2 + this.player.height / 2) * 0.05;
		}

		if (this.player.y - this.cameras.main.scrollY > this.cameras.main.height) this.scene.restart();
	}

	bitCollected() {
		this.bitsCollected++;

		switch (this.bitsCollected) {
			default:
				break;
			case 1:
				this.groundBits.push(new Ground(this, 70, -65, 1));
				this.groundBits.push(new Ground(this, 300, -35, 0));
				new GroundMaker(this, 300, -10);
				break;
			case 2:
				this.groundBits.push(new Ground(this, 450, -105, 2));
				new GroundMaker(this, 551, -36);
				break;
			case 3:
				this.groundBits.push(new Ground(this, 250, -145, 3));
				this.groundBits.push(new Ground(this, 710, -65, 4));
				new PuddingShard(this, 280, -150);
				new GroundMaker(this, 790, -80);
				break;
			case 4:
				this.groundBits.push(new Ground(this, 756, -110, 0));
				this.groundBits.push(new Ground(this, 930, -85, 5));
				new GroundMaker(this, 1090, -80);
				break;
			case 5:
				this.groundBits.push(new Ground(this, 680, -210, 6));
				this.groundBits.push(new Ground(this, 600, -350, 7));
				this.groundBits.push(new Ground(this, 1140, -95, 1));
				this.groundBits.push(new Ground(this, 1360, -120, 9));
				new PuddingShard(this, 745, -345);
				new GroundMaker(this, 1570, -140);
				break;
			case 6:
				this.groundBits.push(new Ground(this, 1265, -240, 6));
				this.groundBits.push(new Ground(this, 1220, -260, 5));
				this.groundBits.push(new Ground(this, 1040, -280, 10));
				this.groundBits.push(new Ground(this, 1560, -120, 10));
				
				this.groundBits.push(new Ground(this, 1740, -230, 11));
				//@ts-ignore
				this.groundBits.push(new Ground(this, 1740, -230, "11_door"));
				new GroundMaker(this, 1570, -140);
				new PuddingShard(this, 1100, -250);
				break;
		}
	}

	startEndCinematic() {
		this.controllingPlayer = false;
		new EndingCinematic(this, 1740, -230, this.player);
	}
}
 
