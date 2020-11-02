class CinePuddingShard extends Phaser.GameObjects.Sprite {
	velX: number;
	velY: number;
	runtime: number = 0;
	cine: EndingCinematic;
	ind: number;

	constructor(scene: Phaser.Scene, cine: EndingCinematic, ind: number, x: number, y: number, velX: number, velY: number) {
		super(scene, x * 4, y * 4, "pudding", 0);
		this.velX = velX;
		this.velY = velY;
		this.cine = cine;
		this.ind = ind;
		this.anims.play('pudding_shard_glow');
		this.setScale(0, 0);
		this.scene.add.existing(this);
	}

	preUpdate(time: number, delta: number) {
		super.preUpdate(time, delta);

		if (this.runtime < 60) {
			this.setAlpha(this.runtime / 60);
			this.setScale(this.runtime / 15);
		}
		this.runtime++;

		if (this.runtime < 120 + this.ind*10) {
			this.x += this.velX;
			this.y += this.velY;
			this.velX = (Math.abs(this.velX) - 0.05) * (this.velX < 0 ? -1 : this.velX > 0 ? 1 : 0);
			this.velY = (Math.abs(this.velY) - 0.05) * (this.velY < 0 ? -1 : this.velY > 0 ? 1 : 0);
		}
		else if (this.runtime < 215) {
			this.x = this.x * 0.9 + (this.cine.x + 450) * 0.1;
			this.y = this.y * 0.95 + (this.cine.y + 350 + this.ind*100) * 0.05;
		}
		else {
			this.setScale(this.scaleX + 2, this.scaleY + 2);
			this.setAlpha(this.alpha - 0.1);
			if (this.alpha < 0) this.destroy();
		}

	}
}
