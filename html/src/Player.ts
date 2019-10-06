class Player extends Phaser.GameObjects.Sprite {
	velX: number;
	velY: number;
	rawX: number;
	rawY: number;
	ground: Ground[];

	constructor(scene: Phaser.Scene, x: number, y: number, groundBits: Ground[]) {
		super(scene, x, y, "player", 0);
		this.rawX = x;
		this.rawY = y;
		this.velX = 0;
		this.velY = 0;

		this.ground = groundBits;

		this.scene.anims.create({
	    key: 'run',
	    frames: this.scene.anims.generateFrameNumbers('player', {start: 0, end: 4}),
	    frameRate: 15,
	    repeat: -1
		});
		this.scene.anims.create({
	    key: 'idle',
	    frames: [{key: "player", frame: 0}, {key: "player", frame: 5}, {key: "player", frame: 6}],
	    frameRate: 3,
	    repeat: -1
		});
		this.anims.play('idle');
		
		this.setScale(4, 4);
		this.setOrigin(0.5, 0);
		this.scene.add.existing(this);
	}

	preUpdate(time: number, delta: number) {
		super.preUpdate(time, delta);

		for (let i = 0; i < Math.abs(this.velX); i++) {
			if (!this.collides(this.rawX + this.sin(this.velX), this.rawY)) {
				this.rawX += this.sin(this.velX);
			}
		}

		for (let i = 0; i < Math.abs(this.velY); i++) {
			if (!this.collides(this.rawX, this.rawY + this.sin(this.velY))) {
				this.rawY += this.sin(this.velY);
			}
			else {
				if (this.velY < 0) this.velY = 0;
			}
		}

		if (this.collides(this.rawX, this.rawY + 1)) this.velY = 0;
		else this.velY = Math.min(this.velY + 1, 16);

		this.x = Math.round(this.rawX / 4) * 4;
		this.y = Math.round(this.rawY / 4) * 4;

		if (this.velX == 0) {
			if (this.anims.currentAnim.key != "idle") this.anims.play('idle');
		}
		else {
			if (this.anims.currentAnim.key != "run") this.anims.play('run');
		}

		if (this.velX < 0) this.scaleX = -4;
		if (this.velX > 0) this.scaleX = 4;

		this.velX = Math.max(0, Math.abs(this.velX) - 0.25) * (this.velX < 0 ? -1 : 1);
	}

	moveLeft(): void {
		this.velX = Math.max(this.velX - 1, this.collides(this.rawX, this.rawY + 1) ? -6 : -6);
	}

	moveRight(): void {
		this.velX = Math.min(this.velX + 1, this.collides(this.rawX, this.rawY + 1) ? 6 : 6);
	}

	jump(): void {
		if (this.collides(this.rawX, this.rawY + 1)) {
			this.velY = -16;
		}
	}

	collides(x: number, y: number): boolean {
		for (let bit of this.ground) {
			if (Math.abs(bit.x - x) > 1200) continue;
			for (let i = -24; i < 24; i += 4) {
				for (let j = 12; j < 60; j += 4) {
					let collides = bit.collidesAt(x + i, y + j);
					if (collides == 1) return true;
					if (collides == 2) { this.scene.scene.restart(); return true; }
				}
			}
		}
		return false;
	}

	sin(num: number): number {
		if (num < 0) return -1;
		if (num > 0) return 1;
		return 0;
	}
}
