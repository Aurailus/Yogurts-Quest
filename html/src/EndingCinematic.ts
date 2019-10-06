class EndingCinematic extends Phaser.GameObjects.Sprite {
	player: Player;
	shards: CinePuddingShard[] = [];
	runtime: number = 0;
	glow: Phaser.GameObjects.Sprite = null;
	pudding: Phaser.GameObjects.Sprite = null;

	constructor(scene: Phaser.Scene, x: number, y: number, player: Player) {
		super(scene, x * 4, y * 4, "");
		this.player = player;
		this.scene.add.existing(this);

		setTimeout(() => {
			this.shards.push(new CinePuddingShard(this.scene, this, 0, this.player.x/4, this.player.y/4, 3, -1));
			this.shards.push(new CinePuddingShard(this.scene, this, 2, this.player.x/4, this.player.y/4, -3, -1));
			this.shards.push(new CinePuddingShard(this.scene, this, 1, this.player.x/4, this.player.y/4, 0, -3));
		}, 300);
	}

	preUpdate() {
		this.runtime ++;
		if (this.runtime == 250) {
			this.glow = this.scene.add.sprite(this.x + 450, this.y + 450, "glow", 0);
			this.glow.setScale(6);
			this.glow.setAlpha(0.5);
		}
		if (this.runtime > 250 && this.runtime <= 280) {
			this.glow.setScale(this.glow.scaleX * 1.08, this.glow.scaleY * 1.08);
			this.glow.setAlpha(Math.min(this.glow.alpha + 0.1, 1));
		}
		if (this.runtime > 280 && this.runtime < 400) {
			this.glow.setScale(this.glow.scaleX * 1.08, this.glow.scaleY * 1.08);
			this.glow.setAlpha(Math.max(this.glow.alpha - 0.05, 0));
		}
		if (this.runtime == 280) {
			let bigGround = this.scene.add.sprite(this.x - 400, this.y + 920, "ground_big");
			bigGround.setScale(4, 4);
			bigGround = this.scene.add.sprite(this.x - 400 + 1784, this.y + 920, "ground_big");
			bigGround.setScale(4, 4);
			this.pudding = new Pudding(this.scene, this.x + 436, this.y + 580);
			//@ts-ignore
			this.scene.chillStars = true;
			this.scene.cameras.main.setBackgroundColor("#372559");
		}
		if (this.runtime == 300) {
			this.player.anims.play('run');
			this.pudding.anims.play('p_run');
		}
		if (this.runtime > 300 && this.runtime < 360) {
			this.pudding.x -= 1;
			this.player.velX = 1;
		}
		if (this.runtime >= 360 && this.runtime < 370) {
			this.pudding.x -= 1;
		}
		if (this.runtime == 370) {
			this.pudding.anims.play('p_idle');
		}
		if (this.runtime == 380 || this.runtime == 400) {
			this.player.velY = -6;
		}
		if (this.runtime > 410 && this.runtime < 415) {
			this.pudding.y -= 4;
		}
		if (this.runtime >= 415 && this.runtime < 419) {
			this.pudding.y += 4;
		}
		if (this.runtime == 440) {
			this.pudding.setScale(4, 4);
		}
		if (this.runtime == 460) {
			this.pudding.anims.play('p_run');
			//@ts-ignore
			this.scene.cameras.main.rawScrollX = this.scene.cameras.main.scrollX;
		}
		if (this.runtime > 460) {
			this.pudding.x += 2;
			this.player.velX = 2;
			//@ts-ignore
			this.scene.cameraMove = false;
			//@ts-ignore
			this.scene.cameras.main.rawScrollX += 1;
			//@ts-ignore
			this.scene.cameras.main.scrollX = Math.round(this.scene.cameras.main.rawScrollX / 4) * 4;
			this.glow.alpha += 0.0040;
			this.scene.children.bringToTop(this.glow);
		}
		if (this.runtime > 750) {
			this.scene.scene.start('CreditsScene');
			this.scene.scene.stop('MainScene');
			this.scene.scene.swapPosition('CreditsScene', 'MainScene');
		}
	}
}
