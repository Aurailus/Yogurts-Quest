class Pudding extends Phaser.GameObjects.Sprite {
	constructor(scene: Phaser.Scene, x: number, y: number) {
		super(scene, x, y, "pudding_dog", 0);

		this.scene.anims.create({
	    key: 'p_run',
	    frames: this.scene.anims.generateFrameNumbers('pudding_dog', {start: 0, end: 4}),
	    frameRate: 15,
	    repeat: -1
		});
		this.scene.anims.create({
	    key: 'p_idle',
	    frames: [{key: "pudding_dog", frame: 0}, {key: "pudding_dog", frame: 5}, {key: "pudding_dog", frame: 6}],
	    frameRate: 3,
	    repeat: -1
		});
		this.anims.play('p_idle');
		
		this.setScale(4, 4);
		this.setOrigin(0.5, 0);
		this.scene.add.existing(this);
		this.setScale(-4, 4);
	}
}
