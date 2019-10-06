class Star extends Phaser.GameObjects.Sprite {
	baseFrame: number;
	curFrame: number = 0;
	tillChange: number = Math.round(Math.random() * 15);
	myOpacity: number = 0;
	alpha: number = 0;
	targetAlpha: number = 0;
	rawX: number = 0;
	rawY: number = 0;

	constructor(scene: Phaser.Scene, x: number, y: number) {
		super(scene, x, y, "star", 0);

		this.x = x * 4;
		this.y = y * 4;
		this.rawX = this.x;
		this.rawY = this.y;
		this.setScale(4, 4);
		this.setOrigin(0, 0);
		scene.add.existing(this);

		this.baseFrame = Math.floor(Math.random() * 4);
		this.setFrame(this.baseFrame * 4);
		this.myOpacity = (Math.floor(Math.random() * 5) + 5)/10;
		this.setAlpha(this.alpha);
	}
	
	preUpdate() {
		this.tillChange--;
		if (this.tillChange <= 0) {
			this.tillChange = 15;
			this.curFrame = (this.curFrame + 1) % 4;
			this.setFrame(this.baseFrame * 4 + this.curFrame);
		}

		this.alpha = this.alpha * 0.7 + this.targetAlpha * 0.3;
		this.setAlpha(this.myOpacity * this.alpha);

		this.x = Math.round(this.rawX / 4) * 4;
		this.y = Math.round(this.rawY / 4) * 4;
	}

	push(x: number, y: number) {
			this.rawX = this.rawX + x * (this.baseFrame + 1);
			// if (this.rawX < 0) this.rawX += this.scene.cameras.main.width;
			// if (this.rawX > this.scene.cameras.main.width) this.rawX -= this.scene.cameras.main.width;
			this.rawY = this.rawY + y * (this.baseFrame + 1);
			// if (this.rawY < 0) this.rawY += this.scene.cameras.main.height;
			// if (this.rawY > this.scene.cameras.main.height) this.rawY -= this.scene.cameras.main.height;
	}

	fadeIn() {
		this.targetAlpha = 1.5;
	}

	fadeReg() {
		this.targetAlpha = 0.5;
	}

	fadeOut() {
		this.targetAlpha = 0;
	}

	stayOnScreen() {
		if (this.rawX < this.scene.cameras.main.scrollX) this.rawX += this.scene.cameras.main.width;
		if (this.rawX > this.scene.cameras.main.scrollX + this.scene.cameras.main.width) this.rawX -= this.scene.cameras.main.width;
		if (this.rawY < this.scene.cameras.main.scrollY) this.rawY += this.scene.cameras.main.height;
		if (this.rawY > this.scene.cameras.main.scrollY + this.scene.cameras.main.height) this.rawY -= this.scene.cameras.main.height;
	}
}
