class PuddingShard extends Phaser.GameObjects.Sprite {
	collected: boolean = false;
	numberTimer: number = -1;
	numberText: Phaser.GameObjects.Text = null;
	cameraX: number;
	cameraY: number;

	constructor(scene: Phaser.Scene, x: number, y: number) {
		super(scene, x * 4, y * 4, "pudding", 0);
		this.scene.anims.create({
	    key: 'pudding_shard_glow',
	    frames: this.scene.anims.generateFrameNumbers('pudding', {start: 0, end: 3}),
	    frameRate: 8,
	    repeat: -1
		});
		this.anims.play('pudding_shard_glow');
		this.setScale(4, 4);
		this.scene.add.existing(this);
	}

	preUpdate(time: number, delta: number) {
		super.preUpdate(time, delta);

		if (this.collected) {
			this.x = this.cameraX + this.scene.cameras.main.scrollX;
			this.y = this.cameraY + this.scene.cameras.main.scrollY;

			this.cameraX = this.cameraX * 0.8 + 32 * 0.2;
			this.cameraY = this.cameraY * 0.9 + 32 * 0.1;

			if (this.cameraX < 36 && this.cameraY < 36) {
				if (this.numberTimer == -1) {
					//@ts-ignore
					this.numberText = this.scene.add.text(0, 0, this.scene.shardsCollected + " / 3", {fontFamily: '"Roboto Condensed"', fontSize: '32px'});
					this.numberTimer = 0;
				}
			}

			if (this.numberText != null) {
				this.numberText.setPosition(this.scene.cameras.main.scrollX + 64, this.scene.cameras.main.scrollY + 12);
				this.numberTimer ++;
				if (this.numberTimer < 30) {
					this.numberText.setAlpha(this.numberTimer/30);
				}
				if (this.numberTimer > 100) {
					this.numberText.setAlpha(1 - (this.numberTimer - 100) / 30);
					this.setAlpha(1 - (this.numberTimer - 100) / 30);
				}
				if (this.numberTimer >= 130) {
					this.numberText.destroy();
					this.destroy();
					return;
				}
			}
		}

		//@ts-ignore
		let dog: Player = this.scene.player;
		if (Phaser.Geom.Rectangle.Overlaps(dog.getBounds(), this.getBounds())) {
			if (!this.collected) {
				//@ts-ignore
				this.scene.shardsCollected ++;
				this.collected = true;
				this.cameraX = this.x - this.scene.cameras.main.scrollX;
				this.cameraY = this.y - this.scene.cameras.main.scrollY;
			}
		}
	}
}
