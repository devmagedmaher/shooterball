
// top canvas
  var canvasTop = document.getElementById('data');
  var ct = canvasTop.getContext('2d');
  canvasTop.width = window.innerWidth;

// canvas area
  var canvas = document.getElementById('canvas');
  var c = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight - canvasTop.height;

// text data
  var data = {
    playing: false,
    
    bullets: 0,
    enemies: 0,
    sparks: 0
  }

  function drawText() {
    ct.clearRect(0, 0, canvasTop.width, canvasTop.height);
    ct.beginPath();
    ct.fillStyle = '#dadada';
    ct.font = '16px tahoma';
  	ct.textBaseline = 'middle';
    ct.textAlign = 'left';
    ct.fillText(`Bullets: ${data.bullets}`, 20, canvasTop.height/2);
    ct.fillText(`Enemies: ${data.enemies}`, 130, canvasTop.height/2);
    ct.fillText(`Sparks: ${data.sparks}`, 240, canvasTop.height/2);
    ct.textAlign = 'right';
    ct.fillText('Click to START game..     press Esc to EXIT ', canvas.width - 40, canvasTop.height/2);
  }
  drawText();











// game variables
  var game = {
    bulletInterval: 60 * 0.01,
    bulletSizeMin: 1,
    bulletSizeMax: 3,
    
    enemyInterval: 60 * 0.09,
    enemySpeed: 0.2,
    enemySizeMin: 10,
    enemySizeMax: 20,
    
    sparksMin: 10,
    sparksMax: 30,
    sparkSizeMin: 0.5,
    sparkSizeMax: 2,

    play: function () {
      game.playing = true;
    },

    pause: function () {
      game.playing = false;
    }
    
  };
  var mouse = {
    xSpeed: 0,
    ySpeed: 0,
    down: false
  }
  var key = {
    left: false,
    right: false,
    up: false,
    down: false,
  };

  var bullets = [];
  var enemies = [];
  var sparks = [];

















var target = {
  x: 750,
  y: canvas.height/2 - 20,
  radius: 20,
  speed: 2,
  
  render: function () {
    this.isOut();
    this.move();
    this.draw();    
  },
  
  draw: function () {    
    c.beginPath();
    c.save();
    c.strokeStyle = "#fff";
    c.arc(this.x, this.y, this.radius, 0, Math.PI*2);
    c.stroke();
    c.strokeStyle = "rgba(255,255,255,0.5)";
    c.lineTo(this.x - this.radius, this.y);
    c.moveTo(this.x, this.y - this.radius);
    c.lineTo(this.x, this.y + this.radius)
    c.stroke();
    c.restore();
  },
  
  move: function () {
    this.x += mouse.xSpeed / (1/this.speed) / 4;
    this.y += mouse.ySpeed / (1/this.speed) / 4;
    // reset speed mouse to zero
    mouse.xSpeed = 0;
    mouse.ySpeed = 0;
  },
  
  isOut: function () {
    if (this.x <= 0) { this.x = 1; }
    if (this.x >= canvas.width) { this.x = canvas.width - 1; }
    if (this.y <= 0) { this.y = 1; }
    if (this.y >= canvas.height) { this.y = canvas.height - 1; }
  }

}














var player = { 
  radius: 20,
  x: canvas.width/2 - 5,
  y: canvas.height/2 - 20,
  xSpeed: 0,
  ySpeed: 0,
  maxSpeed: 8,
  accel: 0.25,
  fraction: 0.98,
  angel: 0,
  fireDefault: 10,
  fireCounter: 10,
  fireSpeed: 0.5,
  
  render: function () {
    this.isOut();
    this.move();
    this.fire();
    this.draw();
  },
  
  draw: function () {
    c.beginPath();
    c.save();
    c.translate(this.x, this.y);
    c.rotate(this.angel);
    c.translate(this.x*-1, this.y*-1);
    c.fillStyle = "#fff";
    c.arc(this.x, this.y, this.radius, 0, Math.PI*2);
    c.fill();
    c.lineWidth = this.radius/2;
    c.strokeStyle = '#900';
    c.arc(this.x, this.y, this.radius, 0, Math.PI*2);
    c.stroke();
    c.moveTo(this.x, this.y - this.radius);
    c.lineTo(this.x-this.radius-(this.fireCounter*3), this.y);
    c.lineTo(this.x, this.y + this.radius);
    c.fill();
    c.restore();
  },
  
  fire: function () {
    this.fireCounter -= this.fireSpeed;
    if (this.fireCounter < 0) { this.fireCounter = this.fireDefault; }
  },

  move: function () {
    // get angel between target and player
    this.angel = this.angelTo(this, target);
    // console.log(angelTo(this,target));
    
    // change speed based on keyboard keys
    if (Math.abs(this.ySpeed) < this.maxSpeed) {
      if (key.up) { this.ySpeed -= this.accel; }
      if (key.down) { this.ySpeed += this.accel; }  
    }
    if (Math.abs(this.xSpeed) < this.maxSpeed) {
      if (key.left) { this.xSpeed -= this.accel; }
      if (key.right) { this.xSpeed += this.accel; }      
    }
    
    // data text xSpeed
    data.xspeed = this.xSpeed;
    
    // fraction
    this.xSpeed *= this.fraction;
    this.ySpeed *= this.fraction;
    
    // movement
    this.x += this.xSpeed;
    this.y += this.ySpeed;
  },
  
  isOut: function () {
    if (this.x < 0) { this.x = 1; this.xSpeed *= -0.5; }
    if (this.x >= canvas.width) { this.x = canvas.width - 1; this.xSpeed *= -0.5; }
    if (this.y <= 0) { this.y = 1; this.ySpeed *= -0.5; }
    if (this.y >= canvas.height) { this.y = canvas.height - 1; this.ySpeed *= -0.5; }
  },
  
  angelTo: function (source, target) {
    return Math.atan2((target.y - source.y), (target.x - source.x));
  }
  
};















function Spark(x, y, color = '#fff') {
  this.x = x;
  this.y = y;
  this.radius = 1;
  this.xSpeed = Math.random() * 26 - 13;
  this.ySpeed = Math.random() * 26 - 13;
  this.fraction = Math.random() * 0.1 + 0.98;
 this.life = Math.random() * 60 * 0.3;
  this.color = color;
 
  
  this.render = function () {
    this.live();
    this.move();
    this.draw();
  };
  
  this.draw = function () {
    c.save();
    c.beginPath();
    c.strokeStyle = this.color;
    c.arc(this.x, this.y, this.radius, 0, Math.PI*2);
    c.stroke();
    c.restore();
  };
  
  this.move = function () {
    this.x += this.xSpeed;
    this.y += this.ySpeed;
    this.xSpeed *= this.fraction;
    this.ySpeed *= this.fraction;
  };
  
  this.live = function () {
    this.life--;
    if (this.life < 0) { this.delete(); }
  }
  
  this.delete = function () {
    sparks.splice(sparks.indexOf(this), 1);
  };

}














function Bullet() {
  this.x = player.x;
  this.y = player.y;
  this.speed = 15;
  this.xSpeed = 0;
  this.ySpeed = 0;
  this.radius = Math.random() * (game.bulletSizeMax-game.bulletSizeMin) + game.bulletSizeMin;
  this.angel = Math.atan2((target.y - player.y), (target.x - player.x));
  this.sparkCount = Math.floor(Math.random() * (game.sparksMax-game.sparksMin) + game.sparksMin);
  
  this.render = function () {
    this.isHit();
    this.move();
    this.isOut();
    this.draw();
  };
  
  this.draw = function () {
    c.save();
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI*2);
    c.fillStyle = '#fff';
    c.fill();
    c.restore();
  };
  
  this.move = function () {
    this.xSpeed = this.speed * Math.cos(this.angel);
    this.ySpeed = this.speed * Math.sin(this.angel);
    
    // movement
    this.x += this.xSpeed;
    this.y += this.ySpeed;
  };
  
  this.isOut = function () {
    if (this.x + this.radius < 0 || this.x - this.radius > canvas.width ||
        this.y + this.radius < 0 || this.y - this.radius > canvas.height) {
      this.delete();
    }
  };
  
  this.isHit = function () {
    // store dx, dy and calculate distance
    var dx, dy, distance;
    for (enemy of enemies) {
      dx = this.x - enemy.x;
      dy = this.y - enemy.y;
      distance = Math.sqrt(dx*dx + dy*dy);
      if (distance < this.radius + enemy.radius) {
        this.spark();
        this.delete();
        enemy.radius -= this.radius/3;
      }      
    }
  }
  this.spark = function () {
      for(var i = 0; i < this.sparkCount; i++) {
        sparks.push(new Spark(this.x, this.y));
      }
  };
  
  this.delete = function () {
    bullets.splice(bullets.indexOf(this), 1);
  };
  
}












function Enemy() {
  this.i = Math.floor(Math.random() * 4);
  this.xArray = [
    Math.random() * canvas.width,
    Math.random() * canvas.width,
    -100,
    canvas.width + 100
  ];
  this.yArray = [
    -100,
    canvas.height + 100,
    Math.random() * canvas.height,
    Math.random() * canvas.height
  ];
  this.x = this.xArray[this.i];
  this.y = this.yArray[this.i];
  this.speed = Math.random() * (game.enemySpeed-(game.enemySpeed/2) + (game.enemySpeed/2))
  this.xSpeed = 0;
  this.ySpeed = 0;
  this.radius = Math.random() * (game.enemySizeMax-game.enemySizeMin) + game.enemySizeMin;
  this.angel = 0;
  this.fraction = 0.98;
  this.dx = 0;
  this.dy = 0;
  this.distance = 0;
  this.sparkCount = Math.floor(Math.random() * (game.sparksMax-game.sparksMin) + game.sparksMin);
  
  this.render = function () {
    this.isDead();
    this.isHit();
    this.followPlayer();
    this.move();
    this.draw();
  };
  
  this.draw = function () {
    c.save();
    c.beginPath();
    c.fillStyle = '#f00';
    c.arc(this.x ,this.y, this.radius, 0, Math.PI*2);
    c.fill();
    c.restore();
  };
  
  this.move = function () {
    // angel speed
    this.xSpeed += this.speed * Math.cos(this.angel);
    this.ySpeed += this.speed * Math.sin(this.angel);
  
    // fraction
    this.xSpeed *= this.fraction;
    this.ySpeed *= this.fraction;
    
    // movement
    this.x += this.xSpeed;
    this.y += this.ySpeed;
    
  };
  
  this.isHit = function () {
    // store dx, dy and calculate distance
    this.dx = this.x - player.x;
    this.dy = this.y - player.y;
    this.distance = Math.sqrt(this.dx*this.dx + this.dy*this.dy);
    if (this.distance < this.radius + player.radius) {
      this.delete();
      this.spark();
    }
  }
  
  this.isDead = function () {
    if (this.radius < game.enemySizeMin) {
      this.delete();
      this.spark();
    } 
  }
  
  this.followPlayer = function () {
    this.angel = Math.atan2((player.y - this.y), (player.x - this.x));
  }
  
  this.spark = function () {
      for(var i = 0; i < this.sparkCount; i++) {
        sparks.push(new Spark(this.x, this.y, '#f30'));
      }
  };
  
  this.delete = function () {
    enemies.splice(enemies.indexOf(this), 1);
  }

}














// counters
  var bulletIntervalCounter = 0;
  var enemyIntervalCounter = 0;




// draw loop function
  function draw() {
    if (game.playing) {

      c.clearRect(0, 0, canvas.width, canvas.height);

      // draw player
      player.render();

      // draw target
      target.render();

      // add bullets to array
      if (mouse.down) {
        bulletIntervalCounter++;
        if (bulletIntervalCounter >= game.bulletInterval) {
          bullets.push(new Bullet());
          bulletIntervalCounter = 0;
        }
      } else {
        bulletIntervalCounter = 0;
      }

      // draw bullets
      for (bullet of bullets) {
        bullet.render();
      }

      // add enemies to array
      enemyIntervalCounter++;
      if (enemyIntervalCounter >= game.enemyInterval) {
        enemyIntervalCounter = 0;
        enemies.push(new Enemy());
      }

      // draw enemies
      for (enemy of enemies) {
        enemy.render();
      }


      // draw sparks
      for (spark of sparks) {
        spark.render();
      }

      // draw text
      data.bullets = bullets.length;
      data.enemies = enemies.length;
      data.sparks = sparks.length;
      drawText();

    }
    requestAnimationFrame(draw);  
  }
  draw();
























// Controls Handling

  canvas.requestPointerLock = canvas.requestPointerLock || canvas.mozRequestPointerLock;

  document.exitPointerLock = document.exitPointerLock || document.mozExitPointerLock;

  canvas.onclick = function() {
    canvas.requestPointerLock();
  }

  document.addEventListener('pointerlockchange', lockChangeAlert, false);
  document.addEventListener('mozpointerlockchange', lockChangeAlert, false);


  function lockChangeAlert() {
    if (document.pointerLockElement === canvas ||
        document.mozPointerLockElement === canvas) {
      console.log('The pointer lock status is now locked');
      document.addEventListener("mousemove", updatePosition, false);

      document.addEventListener('mousedown', mouseDownHandler, false);
      document.addEventListener('mouseup', mouseUpHandler, false);
      
      document.addEventListener('keydown', keydownHandler, false);
      document.addEventListener('keyup', keyupHandler, false);
      
      game.play();
    } else {
      console.log('The pointer lock status is now unlocked');
      document.removeEventListener("mousemove", updatePosition, false);

      document.removeEventListener('mousedown', mouseDownHandler, false);
      document.removeEventListener('mouseup', mouseUpHandler, false);
      
      document.removeEventListener('keydown', keydownHandler, false);
      document.removeEventListener('keyup', keyupHandler, false);

      game.pause();
    }
  }

  function updatePosition(e) {
    mouse.xSpeed += e.movementX;
    mouse.ySpeed += e.movementY;
  }

  function mouseDownHandler() {
    mouse.down = true;
  }

  function mouseUpHandler() {
    mouse.down = false;
  }


  function keydownHandler(e) {
    if (e.key == 'w' || e.key == 'Up' || e.key == 'ArrowUp') { key.up = true; }
    if (e.key == 'a' || e.key == 'Left' || e.key == 'ArrowLeft') { key.left = true; }
    if (e.key == 's' || e.key == 'Down' || e.key == 'ArrowDown') { key.down = true; }
    if (e.key == 'd' || e.key == 'Right' || e.key == 'ArrowRight') { key.right = true; }
  }

  function keyupHandler(e) {
    if (e.key == 'w' || e.key == 'Up' || e.key == 'ArrowUp') { key.up = false; }
    if (e.key == 'a' || e.key == 'Left' || e.key == 'ArrowLeft') { key.left = false; }
    if (e.key == 's' || e.key == 'Down' || e.key == 'ArrowDown') { key.down = false; }
    if (e.key == 'd' || e.key == 'Right' || e.key == 'ArrowRight') { key.right = false; }
  }













