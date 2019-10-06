class CinePuddingShard extends Phaser.GameObjects.Sprite {
    constructor(scene, cine, ind, x, y, velX, velY) {
        super(scene, x * 4, y * 4, "pudding", 0);
        this.runtime = 0;
        this.velX = velX;
        this.velY = velY;
        this.cine = cine;
        this.ind = ind;
        this.anims.play('pudding_shard_glow');
        this.setScale(0, 0);
        this.scene.add.existing(this);
    }
    preUpdate(time, delta) {
        super.preUpdate(time, delta);
        if (this.runtime < 60) {
            this.setAlpha(this.runtime / 60);
            this.setScale(this.runtime / 15);
        }
        this.runtime++;
        if (this.runtime < 120 + this.ind * 10) {
            this.x += this.velX;
            this.y += this.velY;
            this.velX = (Math.abs(this.velX) - 0.05) * (this.velX < 0 ? -1 : this.velX > 0 ? 1 : 0);
            this.velY = (Math.abs(this.velY) - 0.05) * (this.velY < 0 ? -1 : this.velY > 0 ? 1 : 0);
        }
        else if (this.runtime < 215) {
            this.x = this.x * 0.9 + (this.cine.x + 450) * 0.1;
            this.y = this.y * 0.95 + (this.cine.y + 350 + this.ind * 100) * 0.05;
        }
        else {
            this.setScale(this.scaleX + 2, this.scaleY + 2);
            this.setAlpha(this.alpha - 0.1);
            if (this.alpha < 0)
                this.destroy();
        }
    }
}
class CreditsScene extends Phaser.Scene {
    constructor() {
        super({ key: "CreditsScene" });
        this.runtime = 0;
        this.stars = [];
    }
    preload() {
        this.load.spritesheet("player", "res/player.png", { frameWidth: 16, frameHeight: 16 });
        this.load.spritesheet("pudding_dog", "res/pudding_dog.png", { frameWidth: 16, frameHeight: 16 });
        this.load.spritesheet("star", "res/star.png", { frameWidth: 8, frameHeight: 8, startFrame: 0, endFrame: 16 });
    }
    create() {
        this.cameras.main.setBackgroundColor("#fff");
        this.cameras.main.setScroll(0, 0);
        this.anims.create({
            key: 'run',
            frames: this.anims.generateFrameNumbers('player', { start: 0, end: 4 }),
            frameRate: 5,
            repeat: -1
        });
        this.anims.create({
            key: 'p_run',
            frames: this.anims.generateFrameNumbers('pudding_dog', { start: 0, end: 4 }),
            frameRate: 5,
            repeat: -1
        });
        this.anims.create({
            key: 'p_idle',
            frames: [{ key: "pudding_dog", frame: 0 }, { key: "pudding_dog", frame: 5 }, { key: "pudding_dog", frame: 6 }],
            frameRate: 2,
            repeat: -1
        });
        for (let i = 0; i < 200; i++) {
            let x = Math.round(Math.random() * (this.cameras.main.width / 4));
            let y = Math.round(Math.random() * (this.cameras.main.height / 4));
            this.stars.push(new Star(this, x, y));
            this.stars[this.stars.length - 1].fadeIn();
        }
        let midX = this.cameras.main.width / 2;
        let midY = this.cameras.main.height / 2;
        this.add.text(midX - 220, 160, "Yogurt's Quest", { fontFamily: '"Roboto Bold", "Roboto", "Calibri"', fontSize: "64px" });
        this.add.text(midX - 75, 306, "- Starring -", { fontStyle: 'Italic', fontFamily: '"Roboto Italic", "Roboto", "Calibri"', fontSize: "32px" });
        let yogurt = this.add.sprite(midX - 200, 370, "player", 0);
        yogurt.anims.play('run');
        yogurt.setScale(4, 4);
        let pudding = this.add.sprite(midX + 200, 370, "player", 0);
        pudding.anims.play('p_idle');
        pudding.setScale(-4, 4);
        this.add.text(midX - 150, 360, "Yogurt", { fontFamily: '"Roboto Bold", "Roboto", "Calibiri"', fontSize: "24px" });
        this.add.text(midX + 60, 360, "Pudding", { fontFamily: '"Roboto Bold", "Roboto", "Calibiri"', fontSize: "24px" });
        this.add.text(midX - 10, 360, "&", { fontFamily: '"Roboto Bold", "Roboto", "Calibiri"', fontSize: "24px" });
        this.add.text(midX - 280, 460, "Created by Nicole Collings\nFor Ludum Dare 45.", { fontFamily: '"Roboto Bold", "Roboto", "Calibri"', fontSize: "48px" });
        this.add.text(midX - 280, 580, "I hope you enjoyed playing!~", { fontFamily: '"Roboto Bold", "Roboto", "Calibri"', fontSize: "24px" });
    }
    update() {
        if (this.runtime < 90) {
            let hexColor = Phaser.Display.Color.Interpolate.ColorWithColor(new Phaser.Display.Color(255, 255, 255), new Phaser.Display.Color(212, 59, 126), 90, this.runtime);
            this.cameras.main.setBackgroundColor(hexColor);
        }
        this.runtime++;
        for (let star of this.stars) {
            star.push(0, -0.1);
            star.stayOnScreen();
        }
    }
}
class EndingCinematic extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, player) {
        super(scene, x * 4, y * 4, "");
        this.shards = [];
        this.runtime = 0;
        this.glow = null;
        this.pudding = null;
        this.player = player;
        this.scene.add.existing(this);
        setTimeout(() => {
            this.shards.push(new CinePuddingShard(this.scene, this, 0, this.player.x / 4, this.player.y / 4, 3, -1));
            this.shards.push(new CinePuddingShard(this.scene, this, 2, this.player.x / 4, this.player.y / 4, -3, -1));
            this.shards.push(new CinePuddingShard(this.scene, this, 1, this.player.x / 4, this.player.y / 4, 0, -3));
        }, 300);
    }
    preUpdate() {
        this.runtime++;
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
class Ground extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, groundInd) {
        super(scene, x * 4, y * 4 + 64, "ground_" + groundInd, 0);
        this.collisions = [];
        this.destroyTick = -1;
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
        if (this.groundInd == "11_door" && this.x - this.scene.player.x < -64 && this.scene.shardsCollected == 3 && this.destroyTick == -1) {
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
                this.setAlpha(1 - (this.destroyTick - 250) / 10);
                if (this.destroyTick > 260) {
                    this.setPosition(1000000, 1000000);
                    this.destroy();
                }
            }
            this.destroyTick++;
        }
    }
    collidesAt(x, y) {
        let offPosX = Math.round((x - this.x) / 4);
        let offPosY = Math.round((y - this.targetY) / 4);
        if (!(offPosX >= 0 && offPosY >= 0 && offPosX < this.width && offPosY < this.height))
            return 0;
        let texX = Math.floor(offPosX / 16);
        let texY = Math.floor(offPosY / 16);
        return this.collisions[texX][texY];
    }
}
class GroundMaker extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y) {
        super(scene, x * 4, y * 4, "pickup_2", 0);
        this.scene.anims.create({
            key: 'pickup_glow',
            frames: this.scene.anims.generateFrameNumbers('pickup_2', { start: 0, end: 7 }),
            frameRate: 8,
            repeat: -1
        });
        this.anims.play('pickup_glow');
        this.setScale(4, 4);
        this.scene.add.existing(this);
    }
    preUpdate(time, delta) {
        super.preUpdate(time, delta);
        //@ts-ignore
        let dog = this.scene.player;
        if (Phaser.Geom.Rectangle.Overlaps(dog.getBounds(), this.getBounds())) {
            //@ts-ignore
            this.scene.bitCollected();
            this.destroy();
        }
    }
}
class IntroScene extends Phaser.Scene {
    constructor() {
        super({ key: "IntroScene" });
        this.stars = [];
        this.pickups = [];
    }
    preload() {
        this.load.spritesheet("star", "res/star.png", { frameWidth: 8, frameHeight: 8, startFrame: 0, endFrame: 16 });
        this.load.spritesheet("spark", "res/spark.png", { frameWidth: 16, frameHeight: 16, startFrame: 0, endFrame: 64 });
        this.load.spritesheet("pickup", "res/pickup.png", { frameWidth: 16, frameHeight: 16 });
    }
    create() {
        this.stars = [];
        this.pickups = [];
        this.speed = 0.25;
        this.angleChange = 0.001;
        this.controllingSpark = false;
        this.animationRange = -1;
        this.starAngle = -(Math.PI / 1.5);
        this.collided = false;
        this.canDie = false;
        //@ts-ignore
        $("#game").removeClass('active');
        for (let i = 0; i < 200; i++) {
            let x = Math.round(Math.random() * (this.cameras.main.width / 4));
            let y = Math.round(Math.random() * (this.cameras.main.height / 4));
            this.stars.push(new Star(this, x, y));
        }
        for (let i = 0; i < 8; i++) {
            let x = Math.round(Math.random() * (this.cameras.main.width / 4));
            let y = Math.round(Math.random() * (this.cameras.main.height / 4));
            this.pickups.push(new Pickup(this, x, y));
        }
        this.spark = new Spark(this, this.cameras.main.width / 2, this.cameras.main.height / 2);
        // this.text = this.add.text(4, 4, this.collisions.toString());
    }
    update(time, delta) {
        if (this.input.mousePointer.primaryDown && !this.controllingSpark) {
            if (this.input.mousePointer.x > this.cameras.main.width / 2 - 16
                && this.input.mousePointer.x < this.cameras.main.width / 2 + 16
                && this.input.mousePointer.y > this.cameras.main.height / 2 - 16
                && this.input.mousePointer.y < this.cameras.main.height / 2 + 16) {
                this.controllingSpark = true;
                this.canDie = true;
                //@ts-ignore
                $("#game").addClass('active');
                this.animationRange = 0;
            }
        }
        if (this.controllingSpark) {
            this.spark.setPosition(Math.round(this.input.mousePointer.x / 4) * 4, Math.round(this.input.mousePointer.y / 4) * 4);
        }
        if (this.animationRange != -1) {
            if (!this.collided) {
                this.fadeIn(this.animationRange * this.cameras.main.width);
                this.animationRange += 0.02;
                if (this.animationRange >= 1)
                    this.animationRange = -1;
            }
            else {
                this.fadeOut(this.animationRange * this.cameras.main.width);
                this.animationRange -= 0.05;
                if (this.animationRange <= 0)
                    this.scene.restart();
            }
        }
        if (this.speed < 5) {
            if (this.controllingSpark) {
                this.starAngle += this.angleChange;
                this.speed *= 1.001;
                this.angleChange *= 1.000005;
            }
        }
        else {
            this.controllingSpark = false;
            this.canDie = false;
            this.starAngle = Math.PI * 1.5;
            this.speed *= 1.02;
            if (this.speed < 10)
                this.spark.moveToCenter();
            if (this.speed > 10)
                this.spark.y += this.speed;
            if (this.speed > 15)
                this.spark.explode();
            let hexColor = Phaser.Display.Color.Interpolate.ColorWithColor(new Phaser.Display.Color(15, 11, 31), new Phaser.Display.Color(255, 255, 255), 30, Math.min(Math.max(this.speed - 10, 0), 30));
            this.cameras.main.setBackgroundColor(hexColor);
            if (this.speed >= 60) {
                this.game.scene.start('MainScene');
                this.game.scene.stop('IntroScene');
                this.game.scene.swapPosition('MainScene', 'IntroScene');
                return;
            }
        }
        let yOff = Math.sin(this.starAngle);
        let xOff = Math.cos(this.starAngle);
        for (let star of this.stars) {
            star.push(xOff * this.speed, yOff * this.speed);
            star.stayOnScreen();
        }
        for (let pickup of this.pickups) {
            pickup.push(xOff * this.speed, yOff * this.speed);
            if (this.canDie) {
                let distance = Math.sqrt(Math.pow(Math.abs(pickup.x - this.spark.x), 2)
                    + Math.pow(Math.abs(pickup.y - this.spark.y), 2));
                if (distance < 32 && !this.collided) {
                    this.collided = true;
                    this.animationRange = 0.7;
                    this.controllingSpark = false;
                    this.spark.explode();
                }
            }
        }
    }
    fadeIn(range) {
        for (let star of this.stars) {
            let distance = Math.sqrt(Math.pow(Math.abs(star.x - this.cameras.main.width / 2), 2)
                + Math.pow(Math.abs(star.y - this.cameras.main.height / 2), 2));
            if (range > distance && range < distance + 200)
                star.fadeIn();
            if (range > distance + 200)
                star.fadeReg();
        }
        for (let pickup of this.pickups) {
            let distance = Math.sqrt(Math.pow(Math.abs(pickup.x - this.cameras.main.width / 2), 2)
                + Math.pow(Math.abs(pickup.y - this.cameras.main.height / 2), 2));
            if (range + 200 > distance)
                pickup.makeExists();
        }
        let hexColor = Phaser.Display.Color.Interpolate.ColorWithColor(new Phaser.Display.Color(0, 0, 0), new Phaser.Display.Color(15, 11, 31), 1, this.animationRange);
        this.cameras.main.setBackgroundColor(hexColor);
    }
    fadeOut(range) {
        for (let star of this.stars) {
            let distance = Math.sqrt(Math.pow(Math.abs(star.x - this.cameras.main.width / 2), 2)
                + Math.pow(Math.abs(star.y - this.cameras.main.height / 2), 2));
            if (range > distance && range < distance + 200)
                star.fadeIn();
            if (range < distance)
                star.fadeOut();
        }
        for (let i = 0; i < this.pickups.length; i++) {
            let pickup = this.pickups[i];
            let distance = Math.sqrt(Math.pow(Math.abs(pickup.x - this.cameras.main.width / 2), 2)
                + Math.pow(Math.abs(pickup.y - this.cameras.main.height / 2), 2));
            if (range - 200 < distance) {
                pickup.setAlpha(0);
            }
        }
        let hexColor = Phaser.Display.Color.Interpolate.ColorWithColor(new Phaser.Display.Color(0, 0, 0), new Phaser.Display.Color(15, 11, 31), 0.8, this.animationRange);
        this.cameras.main.setBackgroundColor(hexColor);
    }
}
/// <reference path="../@types/phaser.d.ts"/>
let game;
window.onload = () => {
    game = new LD45({
        title: "LD45",
        width: 1,
        height: 1,
        parent: "game",
        backgroundColor: "#000000",
        antialias: false,
        // scene: [IntroScene, MainScene, CreditsScene],
        // scene: [MainScene, IntroScene, CreditsScene],
        scene: [MainScene, CreditsScene, IntroScene],
        physics: {
            default: "arcade",
            arcade: {
                debug: false
            }
        }
    });
};
class LD45 extends Phaser.Game {
    constructor(config) {
        let frame = document.getElementById("game");
        config.width = frame.offsetWidth;
        config.height = frame.offsetHeight;
        super(config);
    }
}
class MainScene extends Phaser.Scene {
    constructor() {
        super({ key: "MainScene" });
        this.runtime = 0;
        this.stars = [];
        this.groundBits = [];
        this.screenOff = 0;
        this.cameraY = 0;
        this.bitsCollected = 0;
        this.shardsCollected = 0;
        this.chillStars = false;
        this.cameraMove = true;
    }
    preload() {
        this.cameras.main.setBackgroundColor("#fff");
        this.load.spritesheet("player", "res/player.png", { frameWidth: 16, frameHeight: 16 });
        this.load.spritesheet("pudding_dog", "res/pudding_dog.png", { frameWidth: 16, frameHeight: 16 });
        this.load.spritesheet("star", "res/star.png", { frameWidth: 8, frameHeight: 8, startFrame: 0, endFrame: 16 });
        this.load.spritesheet("pickup_2", "res/pickup_2.png", { frameWidth: 8, frameHeight: 8, startFrame: 0, endFrame: 16 });
        this.load.spritesheet("pudding", "res/pudding.png", { frameWidth: 16, frameHeight: 16, startFrame: 0, endFrame: 64 });
        this.load.image("keyboard_indicator", "res/keyboard_indicator.png");
        this.load.image("glow", "res/glow.png");
        this.load.image("ground_0", "res/ground_0.png");
        this.load.image("terrain_map_0", "res/terrain_map_0.png");
        this.load.image("ground_1", "res/ground_1.png");
        this.load.image("terrain_map_1", "res/terrain_map_1.png");
        this.load.image("ground_2", "res/ground_2.png");
        this.load.image("terrain_map_2", "res/terrain_map_2.png");
        this.load.image("ground_3", "res/ground_3.png");
        this.load.image("terrain_map_3", "res/terrain_map_3.png");
        this.load.image("ground_4", "res/ground_4.png");
        this.load.image("terrain_map_4", "res/terrain_map_4.png");
        this.load.image("ground_5", "res/ground_5.png");
        this.load.image("terrain_map_5", "res/terrain_map_5.png");
        this.load.image("ground_6", "res/ground_6.png");
        this.load.image("terrain_map_6", "res/terrain_map_6.png");
        this.load.image("ground_7", "res/ground_7.png");
        this.load.image("terrain_map_7", "res/terrain_map_7.png");
        this.load.image("ground_9", "res/ground_9.png");
        this.load.image("terrain_map_9", "res/terrain_map_9.png");
        this.load.image("ground_10", "res/ground_10.png");
        this.load.image("terrain_map_10", "res/terrain_map_10.png");
        this.load.image("ground_11", "res/ground_11.png");
        this.load.image("terrain_map_11", "res/terrain_map_11.png");
        this.load.image("ground_11_door", "res/ground_11_door.png");
        this.load.image("terrain_map_11_door", "res/terrain_map_11_door.png");
        this.load.image("ground_big", "res/ground_big.png");
    }
    create() {
        //@ts-ignore
        $("#game").removeClass('active');
        this.leftKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        this.rightKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        this.jumpKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.runtime = 0;
        this.stars = [];
        this.player = null;
        this.groundBits = [];
        this.screenOff = 0;
        this.cameraY = 0;
        this.bitsCollected = 0;
        this.shardsCollected = 0;
        this.controllingPlayer = true;
        for (let i = 0; i < 200; i++) {
            let x = Math.round(Math.random() * (this.cameras.main.width / 4));
            let y = Math.round(Math.random() * (this.cameras.main.height / 4));
            this.stars.push(new Star(this, x, y));
            this.stars[this.stars.length - 1].fadeReg();
        }
        this.cameraY = -600;
        this.player = new Player(this, 0, 0, this.groundBits);
        this.groundBits.push(new Ground(this, -56, -49, 0));
        new GroundMaker(this, 60, -20);
        this.keyboardIndicator = this.add.sprite(30, -90, "keyboard_indicator", 0);
        this.keyboardIndicator.setScale(4, 4);
    }
    update(time, delta) {
        if (this.runtime < 30) {
            let hexColor = Phaser.Display.Color.Interpolate.ColorWithColor(new Phaser.Display.Color(255, 255, 255), new Phaser.Display.Color(15, 11, 31), 30, this.runtime);
            this.cameras.main.setBackgroundColor(hexColor);
        }
        this.runtime++;
        this.keyboardIndicator.setAlpha(0.4 + Math.sin(this.runtime / 50) * 0.2);
        for (let star of this.stars) {
            if (!this.chillStars)
                star.push(-1, -1);
            else
                star.push(0, 0.1);
            star.stayOnScreen();
        }
        if (!this.chillStars)
            this.screenOff += 0.025;
        if (this.controllingPlayer) {
            if (this.leftKey.isDown) {
                this.player.moveLeft();
            }
            if (this.rightKey.isDown) {
                this.player.moveRight();
            }
            if (this.jumpKey.isDown) {
                this.player.jump();
            }
        }
        this.groundBits[0].collidesAt(this.player.x, this.player.y);
        if (this.cameraMove) {
            this.cameras.main.scrollX = this.player.x - this.cameras.main.width / 2 + this.player.width / 2;
            this.cameras.main.scrollY = Math.round(this.cameraY / 4 + Math.sin(this.screenOff) * 2) * 4;
        }
        if (this.player.collides(this.player.rawX, this.player.rawY + 1)) {
            this.cameraY = this.cameraY * 0.95 + (this.player.y - this.cameras.main.height / 2 + this.player.height / 2) * 0.05;
        }
        if (this.player.y - this.cameras.main.scrollY > this.cameras.main.height)
            this.scene.restart();
    }
    bitCollected() {
        this.bitsCollected++;
        switch (this.bitsCollected) {
            default:
                break;
            case 1:
                this.groundBits.push(new Ground(this, 70, -65, 1));
                this.groundBits.push(new Ground(this, 300, -35, 0));
                new GroundMaker(this, 300, -10);
                break;
            case 2:
                this.groundBits.push(new Ground(this, 450, -105, 2));
                new GroundMaker(this, 551, -36);
                break;
            case 3:
                this.groundBits.push(new Ground(this, 250, -145, 3));
                this.groundBits.push(new Ground(this, 710, -65, 4));
                new PuddingShard(this, 280, -150);
                new GroundMaker(this, 790, -80);
                break;
            case 4:
                this.groundBits.push(new Ground(this, 756, -110, 0));
                this.groundBits.push(new Ground(this, 930, -85, 5));
                new GroundMaker(this, 1090, -80);
                break;
            case 5:
                this.groundBits.push(new Ground(this, 680, -210, 6));
                this.groundBits.push(new Ground(this, 600, -350, 7));
                this.groundBits.push(new Ground(this, 1140, -95, 1));
                this.groundBits.push(new Ground(this, 1360, -120, 9));
                new PuddingShard(this, 745, -345);
                new GroundMaker(this, 1570, -140);
                break;
            case 6:
                this.groundBits.push(new Ground(this, 1265, -240, 6));
                this.groundBits.push(new Ground(this, 1220, -260, 5));
                this.groundBits.push(new Ground(this, 1040, -280, 10));
                this.groundBits.push(new Ground(this, 1560, -120, 10));
                this.groundBits.push(new Ground(this, 1740, -230, 11));
                //@ts-ignore
                this.groundBits.push(new Ground(this, 1740, -230, "11_door"));
                new GroundMaker(this, 1570, -140);
                new PuddingShard(this, 1100, -250);
                break;
        }
    }
    startEndCinematic() {
        this.controllingPlayer = false;
        new EndingCinematic(this, 1740, -230, this.player);
    }
}
class Pickup extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, "pickup", 0);
        this.rawX = 0;
        this.rawY = 0;
        this.scale = 0;
        this.exists = false;
        this.x = x * 4;
        this.y = y * 4;
        this.rawX = this.x;
        this.rawY = this.y;
        this.scene.anims.create({
            key: 'pickup',
            frames: this.scene.anims.generateFrameNumbers('pickup', { start: 0, end: 5 }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.play('pickup');
        this.scene.add.existing(this);
    }
    preUpdate(time, delta) {
        super.preUpdate(time, delta);
        if (this.exists && this.scale < 1)
            this.scale += 0.1;
        this.setScale(this.scale * 4, this.scale * 4);
        this.x = Math.round(this.rawX / 4) * 4;
        this.y = Math.round(this.rawY / 4) * 4;
    }
    push(x, y) {
        this.rawX = this.rawX + x * 5;
        if (this.rawX < 0)
            this.rawX += this.scene.cameras.main.width;
        if (this.rawX > this.scene.cameras.main.width)
            this.rawX -= this.scene.cameras.main.width;
        this.rawY = this.rawY + y * 5;
        if (this.rawY < 0)
            this.rawY += this.scene.cameras.main.height;
        if (this.rawY > this.scene.cameras.main.height)
            this.rawY -= this.scene.cameras.main.height;
    }
    makeExists() {
        if (!this.exists) {
            this.anims.setProgress(0);
            this.exists = true;
        }
    }
}
class Player extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, groundBits) {
        super(scene, x, y, "player", 0);
        this.rawX = x;
        this.rawY = y;
        this.velX = 0;
        this.velY = 0;
        this.ground = groundBits;
        this.scene.anims.create({
            key: 'run',
            frames: this.scene.anims.generateFrameNumbers('player', { start: 0, end: 4 }),
            frameRate: 15,
            repeat: -1
        });
        this.scene.anims.create({
            key: 'idle',
            frames: [{ key: "player", frame: 0 }, { key: "player", frame: 5 }, { key: "player", frame: 6 }],
            frameRate: 3,
            repeat: -1
        });
        this.anims.play('idle');
        this.setScale(4, 4);
        this.setOrigin(0.5, 0);
        this.scene.add.existing(this);
    }
    preUpdate(time, delta) {
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
                if (this.velY < 0)
                    this.velY = 0;
            }
        }
        if (this.collides(this.rawX, this.rawY + 1))
            this.velY = 0;
        else
            this.velY = Math.min(this.velY + 1, 16);
        this.x = Math.round(this.rawX / 4) * 4;
        this.y = Math.round(this.rawY / 4) * 4;
        if (this.velX == 0) {
            if (this.anims.currentAnim.key != "idle")
                this.anims.play('idle');
        }
        else {
            if (this.anims.currentAnim.key != "run")
                this.anims.play('run');
        }
        if (this.velX < 0)
            this.scaleX = -4;
        if (this.velX > 0)
            this.scaleX = 4;
        this.velX = Math.max(0, Math.abs(this.velX) - 0.25) * (this.velX < 0 ? -1 : 1);
    }
    moveLeft() {
        this.velX = Math.max(this.velX - 1, this.collides(this.rawX, this.rawY + 1) ? -6 : -6);
    }
    moveRight() {
        this.velX = Math.min(this.velX + 1, this.collides(this.rawX, this.rawY + 1) ? 6 : 6);
    }
    jump() {
        if (this.collides(this.rawX, this.rawY + 1)) {
            this.velY = -16;
        }
    }
    collides(x, y) {
        for (let bit of this.ground) {
            if (Math.abs(bit.x - x) > 1200)
                continue;
            for (let i = -24; i < 24; i += 4) {
                for (let j = 12; j < 60; j += 4) {
                    let collides = bit.collidesAt(x + i, y + j);
                    if (collides == 1)
                        return true;
                    if (collides == 2) {
                        this.scene.scene.restart();
                        return true;
                    }
                }
            }
        }
        return false;
    }
    sin(num) {
        if (num < 0)
            return -1;
        if (num > 0)
            return 1;
        return 0;
    }
}
class Pudding extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, "pudding_dog", 0);
        this.scene.anims.create({
            key: 'p_run',
            frames: this.scene.anims.generateFrameNumbers('pudding_dog', { start: 0, end: 4 }),
            frameRate: 15,
            repeat: -1
        });
        this.scene.anims.create({
            key: 'p_idle',
            frames: [{ key: "pudding_dog", frame: 0 }, { key: "pudding_dog", frame: 5 }, { key: "pudding_dog", frame: 6 }],
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
class PuddingShard extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y) {
        super(scene, x * 4, y * 4, "pudding", 0);
        this.collected = false;
        this.numberTimer = -1;
        this.numberText = null;
        this.scene.anims.create({
            key: 'pudding_shard_glow',
            frames: this.scene.anims.generateFrameNumbers('pudding', { start: 0, end: 3 }),
            frameRate: 8,
            repeat: -1
        });
        this.anims.play('pudding_shard_glow');
        this.setScale(4, 4);
        this.scene.add.existing(this);
    }
    preUpdate(time, delta) {
        super.preUpdate(time, delta);
        if (this.collected) {
            this.x = this.cameraX + this.scene.cameras.main.scrollX;
            this.y = this.cameraY + this.scene.cameras.main.scrollY;
            this.cameraX = this.cameraX * 0.8 + 32 * 0.2;
            this.cameraY = this.cameraY * 0.9 + 32 * 0.1;
            if (this.cameraX < 36 && this.cameraY < 36) {
                if (this.numberTimer == -1) {
                    //@ts-ignore
                    this.numberText = this.scene.add.text(0, 0, this.scene.shardsCollected + " / 3", { fontFamily: '"Roboto Condensed"', fontSize: '32px' });
                    this.numberTimer = 0;
                }
            }
            if (this.numberText != null) {
                this.numberText.setPosition(this.scene.cameras.main.scrollX + 64, this.scene.cameras.main.scrollY + 12);
                this.numberTimer++;
                if (this.numberTimer < 30) {
                    this.numberText.setAlpha(this.numberTimer / 30);
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
        let dog = this.scene.player;
        if (Phaser.Geom.Rectangle.Overlaps(dog.getBounds(), this.getBounds())) {
            if (!this.collected) {
                //@ts-ignore
                this.scene.shardsCollected++;
                this.collected = true;
                this.cameraX = this.x - this.scene.cameras.main.scrollX;
                this.cameraY = this.y - this.scene.cameras.main.scrollY;
            }
        }
    }
}
class Spark extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, "spark", 0);
        this.curFrame = 0;
        this.tillChange = 15;
        this.scale = 1;
        this.exploding = false;
        this.alphaA = 2;
        this.age = 0;
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
class Star extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, "star", 0);
        this.curFrame = 0;
        this.tillChange = Math.round(Math.random() * 15);
        this.myOpacity = 0;
        this.alpha = 0;
        this.targetAlpha = 0;
        this.rawX = 0;
        this.rawY = 0;
        this.x = x * 4;
        this.y = y * 4;
        this.rawX = this.x;
        this.rawY = this.y;
        this.setScale(4, 4);
        this.setOrigin(0, 0);
        scene.add.existing(this);
        this.baseFrame = Math.floor(Math.random() * 4);
        this.setFrame(this.baseFrame * 4);
        this.myOpacity = (Math.floor(Math.random() * 5) + 5) / 10;
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
    push(x, y) {
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
        if (this.rawX < this.scene.cameras.main.scrollX)
            this.rawX += this.scene.cameras.main.width;
        if (this.rawX > this.scene.cameras.main.scrollX + this.scene.cameras.main.width)
            this.rawX -= this.scene.cameras.main.width;
        if (this.rawY < this.scene.cameras.main.scrollY)
            this.rawY += this.scene.cameras.main.height;
        if (this.rawY > this.scene.cameras.main.scrollY + this.scene.cameras.main.height)
            this.rawY -= this.scene.cameras.main.height;
    }
}
