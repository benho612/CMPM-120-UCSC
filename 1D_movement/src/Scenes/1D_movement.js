class _1D_movment extends Phaser.Scene {
    constructor() {
        super("_1D_movment");
        this.my = {sprite: {}, bullets: []};  // Create an object to hold sprite bindings

        this.bodyX = 300;
        this.bodyY = 350;
        
    }

    preload() {
        this.load.setPath("./assets/");

        this.load.atlasXML("ScribblePlatformer", "spritesheet_default.png", "spritesheet_default.xml");

    }

    create() {
        let my = this.my;

        my.sprite.player = this.add.sprite(this.bodyX, this.bodyY, 'ScribblePlatformer', 'character_roundGreen.png');

        this.keys = this.input.keyboard.addKeys({
            left: 'A',
            right: 'D',
            shoot: 'SPACE'
          });
        
    }

    update() {
        let my = this.my;
      
        if (this.keys.left.isDown) 
          my.sprite.player.x -= 5;
        else if (this.keys.right.isDown) 
          my.sprite.player.x += 5;
        

      // SHOOT
      if (Phaser.Input.Keyboard.JustDown(this.keys.shoot)) 
        {
            const bullet = this.add.sprite(my.sprite.player.x, my.sprite.player.y - 20, "ScribblePlatformer", "item_arrow.png");
            bullet.setFlipY(true);      // or bullet.setScale(1, -1);
            bullet.setAngle(270);       // optional rotation
            my.bullets.push(bullet);
        }
  
      // BULLET MOVEMENT + CLEANUP
      for (let i = my.bullets.length - 1; i >= 0; i--) {
        my.bullets[i].y -= 10;
        if (my.bullets[i].y < 0) {
          my.bullets[i].destroy();
          my.bullets.splice(i, 1);
        }
      }
    }
}