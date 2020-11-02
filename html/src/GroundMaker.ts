class GroundMaker extends Phaser.GameObjects.Sprite {
	constructor(scene: Phaser.Scene, x: number, y: number) {
		super(scene, x * 4, y * 4, "pickup_2", 0);
		this.scene.anims.create({
	    key: 'pickup_glow',
	    frames: this.scene.anims.generateFrameNumbers('pickup_2', {start: 0, end: 7}),
	    frameRate: 8,
	    repeat: -1
		});
		this.anims.play('pickup_glow');
		this.setScale(4, 4);
		this.scene.add.existing(this);
	}

	preUpdate(time: number, delta: number) {
		super.preUpdate(time, delta);

		//@ts-ignore
		let dog: Player = this.scene.player;
		if (Phaser.Geom.Rectangle.Overlaps(dog.getBounds(), this.getBounds())) {
			//@ts-ignore
			this.scene.bitCollected();
			this.destroy();
		}
	}
}
