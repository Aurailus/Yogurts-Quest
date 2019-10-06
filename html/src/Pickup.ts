class Pickup extends Phaser.GameObjects.Sprite {
	rawX: number = 0;
	rawY: number = 0;
	scale: number = 0;
	exists: boolean = false;

	constructor(scene: Phaser.Scene, x: number, y: number) {
		super(scene, x, y, "pickup", 0);
		this.x = x * 4;
		this.y = y * 4;
		this.rawX = this.x;
		this.rawY = this.y;
		this.scene.anims.create({
	    key: 'pickup',
	    frames: this.scene.anims.generateFrameNumbers('pickup', {start: 0, end: 5}),
	    frameRate: 10,
	    repeat: -1
		});
		this.anims.play('pickup');
		this.scene.add.existing(this);
	}

	preUpdate(time: number, delta: number) {
		super.preUpdate(time, delta);
		if (this.exists && this.scale < 1) this.scale += 0.1;
		this.setScale(this.scale * 4, this.scale * 4);
		this.x = Math.round(this.rawX / 4) * 4;
		this.y = Math.round(this.rawY / 4) * 4;
	}

	push(x: number, y: number) {
			this.rawX = this.rawX + x * 5;
			if (this.rawX < 0) this.rawX += this.scene.cameras.main.width;
			if (this.rawX > this.scene.cameras.main.width) this.rawX -= this.scene.cameras.main.width;
			this.rawY = this.rawY + y * 5;
			if (this.rawY < 0) this.rawY += this.scene.cameras.main.height;
			if (this.rawY > this.scene.cameras.main.height) this.rawY -= this.scene.cameras.main.height;
	}

	makeExists() {
		if (!this.exists) {
			this.anims.setProgress(0);
			this.exists = true;
		}
	}
}
