class Spark extends Phaser.GameObjects.Sprite {
	curFrame: number = 0;
	tillChange: number = 15;
	scale: number = 1;
	exploding: boolean = false;
	alphaA: number = 2;
	age: number = 0;

	constructor(scene: Phaser.Scene, x: number, y: number) {
		super(scene, x, y, "spark", 0);
		this.setScale(4, 4);
		this.scene.add.existing(this);
		this.setAlpha(0);
	}
	
	preUpdate() {
		this.age++;
		if (this.age > 60 && this.age < 120) {
			this.setAlpha((this.age - 60) / 60);
		}

		this.tillChange--;
		if (this.tillChange <= 0) {
			this.tillChange = 15;
			this.curFrame = (this.curFrame + 1) % 4;
			this.setFrame(this.curFrame);
		}

		if (this.exploding) {
			this.scale += 2;
			this.setAlpha(this.alphaA -= 0.2);
			this.setScale(4 * this.scale, 4 * this.scale);
		}
	}

	explode() {
		this.exploding = true;
	}

	moveToCenter() {
		let centerX = this.scene.cameras.main.width / 2;
		let centerY = this.scene.cameras.main.height / 2;

		this.x = this.x * 0.9 + centerX * 0.1;
		this.y = this.y * 0.9 + centerY * 0.1;	
	}
}
