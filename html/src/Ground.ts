class Ground extends Phaser.GameObjects.Sprite {
	ind: number;
	collisions: number[][] = [];
	groundInd: any;

	targetY: number;
	destroyTick: number = -1;

	constructor(scene: Phaser.Scene, x: number, y: number, groundInd: any) {
		super(scene, x * 4, y * 4 + 64, "ground_" + groundInd, 0);
		this.ind = groundInd;
		this.setScale(4, 4);
		this.setOrigin(0, 0);
		this.scene.add.existing(this);
		this.setAlpha(0);
		this.targetY = y * 4;

		this.groundInd = groundInd;

		for (let i = 0; i < this.width / 16; i++) {
			this.collisions[i] = [];
			for (let j = 0; j < this.height / 16; j++) {
				let color = this.scene.textures.getPixel(i, j, "terrain_map_" + this.ind);
				this.collisions[i][j] = color.red == 255 ? 1 : color.green == 255 ? 2 : 0;
			}
		}
	}

	preUpdate() {
		this.setAlpha(Math.min(this.alpha + 0.3, 1));
		this.y = this.y * 0.9 + this.targetY * 0.1;

		//@ts-ignore
		if (this.groundInd == "11_door" && this.x - this.scene.player.x < -64  && this.scene.shardsCollected == 3 && this.destroyTick == -1) {
			this.destroyTick = 0;
		}

		if (this.destroyTick >= 0) {
			if (this.destroyTick == 10) {
				//@ts-ignore
				this.scene.startEndCinematic();
			}
			if (this.destroyTick >= 250) {
				this.setScale(this.scaleX + 0.3, this.scaleY + 0.3);
				this.setPosition(this.x - 34, this.y - 34);
				this.setAlpha(1 - (this.destroyTick-250) / 10);
				if (this.destroyTick > 260) {
					this.setPosition(1000000, 1000000);
					this.destroy();
				}
			}
			this.destroyTick++;
		}
	}


	collidesAt(x: number, y: number): number {
		let offPosX = Math.round((x - this.x) / 4);
		let offPosY = Math.round((y - this.targetY) / 4);

		if (!(offPosX >= 0 && offPosY >= 0 && offPosX < this.width && offPosY < this.height)) return 0;

		let texX = Math.floor(offPosX / 16);
		let texY = Math.floor(offPosY / 16);

		return this.collisions[texX][texY];
	}
}
