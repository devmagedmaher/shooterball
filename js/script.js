



// collision calculation function
  function collision(source, target) {
    var dx = source.x - target.x;
    var dy = source.y - target.y;
    var distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < source.radius + target.radius) {

      collisionalAngle = Math.atan2(dy, dx);
      source.magnitude = Math.sqrt(source.xSpeed * source.xSpeed + source.ySpeed * source.ySpeed);
      target.magnitude = Math.sqrt(target.xSpeed * target.xSpeed + target.ySpeed * target.ySpeed);
      source.direction = Math.atan2(source.ySpeed, source.xSpeed);
      target.direction = Math.atan2(target.ySpeed, target.xSpeed);
      source.xSpeedNew =  source.magnitude * Math.cos(source.direction - collisionalAngle);
      source.ySpeedNew =  source.magnitude * Math.sin(source.direction - collisionalAngle);
      target.xSpeedNew =  target.magnitude * Math.cos(target.direction - collisionalAngle);
      target.ySpeedNew =  target.magnitude * Math.sin(target.direction - collisionalAngle);
      source.xSpeedFinal = ((source.radius - target.radius) * source.xSpeedNew + (target.radius + target.radius) * target.xSpeedNew) / (source.radius + target.radius);
      target.xSpeedFinal = ((source.radius + source.radius) * source.xSpeedNew + (target.radius - source.radius) * target.xSpeedNew) / (source.radius + target.radius);
      source.ySpeedFinal = source.ySpeedNew;
      target.ySpeedFinal = target.ySpeedNew;


      source.xSpeedLast = Math.cos(collisionalAngle) * source.xSpeedFinal + Math.cos(collisionalAngle + Math.PI / 2) * source.ySpeedFinal;
      source.ySpeedLast = Math.sin(collisionalAngle) * source.xSpeedFinal + Math.sin(collisionalAngle + Math.PI / 2) * source.ySpeedFinal;

      source.xSpeed = source.xSpeedLast * 1.1;
      source.ySpeed = source.ySpeedLast * 1.1;

      target.xSpeedLast = Math.cos(collisionalAngle) * target.xSpeedFinal + Math.cos(collisionalAngle + Math.PI / 2) * target.ySpeedFinal;
      target.ySpeedLast = Math.sin(collisionalAngle) * target.xSpeedFinal + Math.sin(collisionalAngle + Math.PI / 2) * target.ySpeedFinal;

      target.xSpeed = target.xSpeedLast * 1.1;
      target.ySpeed = target.ySpeedLast * 1.1;    
    }
  }



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

    bulletInterval: 60 * 0.08,
    bulletSizeMin: 1,
    bulletSizeMax: 3,
    bulletPower: 2,
    
    enemyInterval: 60 * 1,
    enemySpeed: 0.2,
    enemySizeMin: 10,
    enemySizeMax: 20,
    enemyDirections: 1, // from 1 to 4 only;

    sparksMin: 30,
    sparksMax: 60,
    sparkSizeMin: 0.5,
    sparkSizeMax: 2.5,

    bombSizeMin: 20,
    bombSizeMax: 60,

    playing: false,

    play: function () {
      game.playing = true;
    },

    pause: function () {
      game.playing = false;
      document.exitPointerLock();
    }
    
  };
  var mouse = {
    xSpeed: 0,
    ySpeed: 0,
    down: false,
    alwaysDown: false
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
  var bombs = [];
















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



















function Bomb(x, y) {
  this.x = x;
  this.y = y;
  this.radius = Math.random() * (game.bombSizeMax-game.bombSizeMin) + game.bombSizeMin;

  this.render = function () {
    this.live();
    this.isHit();
    this.draw();
  };

  this.draw = function () {
    c.save();

    c.beginPath();
    c.strokeStyle = '#fff';
    c.arc(this.x, this.y, this.radius, 0, Math.PI*2);
    c.stroke();
    c.restore();
    // c.clip();
    // c.fillStyle = '#000';
    // c.arc(this.x, this.y, this.radius, 0, Math.PI*2);
  };

  this.live = function () {
    this.radius -= 0.02;
    if (this.radius <= game.bombSizeMin) {
      this.delete();
    }
  },

  this.isHit = function () {
    var dx;
    var dy;
    var distance;
    for (enemy of enemies) {
      dx = (this.x - enemy.x);
      dy = (this.y - enemy.y);
      distance = Math.sqrt(dx*dx+dy*dy);
      if (distance < this.radius + enemy.radius) {
        enemy.life -= 0.1;
        enemy.target = this;
      }
    }
  },

  this.delete = function () {
    bombs.splice(bombs.indexOf(this), 1);
  }
}
























var player = { 
  radius: 20,
  x: canvas.width/2 - 5,
  y: canvas.height/2 - 20,
  xSpeed: 0,
  ySpeed: 0,
  maxSpeed: 16,
  accel: 0.25,
  fraction: 0.95,
  angel: 0,
  fireDefault: 10,
  fireCounter: 10,
  fireSpeed: 0.5,
  dashSpeed: 30,
  dashMode: false,
  dashTime: 15,
  dashTimeCounter: 0,
  life: 20,
  
  render: function () {
    this.isDead();
    this.isOut();
    this.move();
    this.fire();
    this.draw();
  },
  
  draw: function () {
    c.save();

    c.beginPath();
    c.translate(this.x, this.y);
    c.rotate(this.angel);
    c.translate(this.x*-1, this.y*-1);
    c.fillStyle = "#fff";
    c.arc(this.x, this.y, this.radius, 0, Math.PI*2);
    c.fill();

    c.beginPath();
    c.moveTo(this.x, this.y - this.radius);
    c.lineTo(this.x-this.radius-(this.fireCounter*3), this.y);
    c.lineTo(this.x, this.y + this.radius);
    c.fill();

    c.beginPath();
    c.lineWidth = this.radius/10;
    c.strokeStyle = '#900';
    c.arc(this.x, this.y, this.radius, 0, Math.PI*2);
    c.stroke();

    c.beginPath();
    c.lineWidth = this.radius/5;
    c.strokeStyle = '#e00';
    c.arc(this.x, this.y, this.radius, 0, (Math.PI*2)*(this.life/this.radius));
    c.stroke();

    c.restore();
  },
  
  fire: function () {
    this.fireCounter -= this.fireSpeed;
    if (this.fireCounter < 0) { this.fireCounter = this.fireDefault; }
  },

  move: function () {
    // get angel between target and player
    this.angel = this.angelTo(this, target);
    
    // change speed based on keyboard keys
    if (Math.abs(this.ySpeed) < this.maxSpeed) {
      if (key.up) { this.ySpeed -= this.accel; }
      if (key.down) { this.ySpeed += this.accel; }  
    }
    if (Math.abs(this.xSpeed) < this.maxSpeed) {
      if (key.left) { this.xSpeed -= this.accel; }
      if (key.right) { this.xSpeed += this.accel; }      
    }
    
    // fraction
    this.xSpeed *= this.fraction;
    this.ySpeed *= this.fraction;
    
    // movement
    this.x += this.xSpeed;
    this.y += this.ySpeed;

    // count dash time when needed
    if(this.dashTimeCounter > 0) { this.dashTimeCounting(); }

  },
  
  isOut: function () {
    if (this.x < 0) { this.x = 1; this.xSpeed *= -0.5; }
    if (this.x >= canvas.width) { this.x = canvas.width - 1; this.xSpeed *= -0.5; }
    if (this.y <= 0) { this.y = 1; this.ySpeed *= -0.5; }
    if (this.y >= canvas.height) { this.y = canvas.height - 1; this.ySpeed *= -0.5; }
  },

  isDead: function () {
    if (this.life < 0) {
      game.pause();
      this.life = this.radius;
    }
  },
  
  angelTo: function (source, target) {
    return Math.atan2((target.y - source.y), (target.x - source.x));
  },

  damage: function () {
    this.bloodScreen();
    console.log(this.life, (Math.PI*2)*(this.life/this.radius));
  },

  bloodScreen: function () {
    c.save();
    c.beginPath();
    c.fillStyle = 'rgba(255,0,0,0.1)';
    c.fillRect(0, 0, canvas.width, canvas.height);
    c.restore();    
  },

  dash: function () {
    this.xSpeed = this.dashSpeed * Math.cos(this.angel);
    this.ySpeed = this.dashSpeed * Math.sin(this.angel);
    this.dashTimeCounter = this.dashTime;
  },

  dashTimeCounting: function () {
    this.dashTimeCounter--;
  },

  bomb: function () {
    bombs.push(new Bomb(this.x, this.y));
  }
  
};















function Spark(x, y, color = '#fff') {
  this.x = x;
  this.y = y;
  this.radius = 1;
  this.xSpeed = Math.random() * 26 - 13;
  this.ySpeed = Math.random() * 26 - 13;
  this.fraction = Math.random() * 0.01 + 0.98;
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
  };
  
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
  this.power = game.bulletPower;
  
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
        enemy.life -= this.radius*this.power;
      }      
    }
  };

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
  this.i = Math.floor(Math.random() * game.enemyDirections);
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
  this.target = player;
  this.collisionTimeDefault = 2;
  this.collisionTime = this.collisionTimeDefault;
  this.life = this.radius;

  this.render = function () {
    this.isCollision();
    this.isDead();
    this.isHitPlayer();
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
    c.beginPath();
    c.strokeStyle = '#fff';
    c.lineWidth = 2;
    c.arc(this.x, this.y, this.radius, 0, (Math.PI*2)*(this.life/this.radius));
    c.stroke();
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
  
  this.isHitPlayer = function () {
    // store dx, dy and calculate distance
    this.dx = this.x - player.x;
    this.dy = this.y - player.y;
    this.distance = Math.sqrt(this.dx*this.dx + this.dy*this.dy);
    if (this.distance < this.radius + player.radius) {
      if (player.dashTimeCounter > 0) {
        console.log('killed enemy');
        this.spark();
      } else {
        player.damage();
        player.life -= this.radius/10;
      }
      this.delete();
    }
    if (this.distance < this.radius + (player.radius*2)) {
      this.target = player;
    }
  }
  
  this.isDead = function () {
    if (this.life < 1) {
      this.delete();
      this.spark();
    } 
  }

  this.isCollision = function () {
    for (enemy of enemies) {
      if (enemy == this) { continue; }
      collision(this, enemy);
    }
  }
  
  this.followPlayer = function () {
    this.angel = Math.atan2((this.target.y - this.y), (this.target.x - this.x));
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















// draw pause text
function drawPauseText() {
  c.save();
  c.beginPath();
  c.font = 'bold 48px tahoma';
  c.textAlign = 'center';
  c.strokeStyle = '#000';
  c.lineWidth = 10;
  c.strokeText('Click to START!..', canvas.width/2, canvas.height/2);
  c.fillStyle = '#fff';
  c.fillText('Click to START!..', canvas.width/2, canvas.height/2);
  c.restore();
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
      if (key.space) {
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

      // draw bombs
      for (bomb of bombs) {
        bomb.render();
      }

      // draw text
      data.bullets = bullets.length;
      data.enemies = enemies.length;
      data.sparks = sparks.length;
      drawText();

    } else {
      drawPauseText();
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
      
      document.addEventListener('keydown', keydownHandler, false);
      document.addEventListener('keyup', keyupHandler, false);
      
      game.play();
    } else {
      console.log('The pointer lock status is now unlocked');
      document.removeEventListener("mousemove", updatePosition, false);
      document.removeEventListener('mousedown', mouseDownHandler, false);
      
      document.removeEventListener('keydown', keydownHandler, false);
      document.removeEventListener('keyup', keyupHandler, false);

      game.pause();
    }
  }

  function updatePosition(e) {
    mouse.xSpeed += e.movementX;
    mouse.ySpeed += e.movementY;
  }

  function mouseDownHandler(e) {
    if (e.button === 0) {
      player.dash();
    }
    if (e.button === 2) {
      player.bomb();
    }
  }


  function keydownHandler(e) {
    if (e.key == 'w' || e.key == 'Up' || e.key == 'ArrowUp') { key.up = true; }
    if (e.key == 'a' || e.key == 'Left' || e.key == 'ArrowLeft') { key.left = true; }
    if (e.key == 's' || e.key == 'Down' || e.key == 'ArrowDown') { key.down = true; }
    if (e.key == 'd' || e.key == 'Right' || e.key == 'ArrowRight') { key.right = true; }
    if (e.key == ' ') { if (key.space) { key.space = false; } else { key.space = true; } }
  }

  function keyupHandler(e) {
    if (e.key == 'w' || e.key == 'Up' || e.key == 'ArrowUp') { key.up = false; }
    if (e.key == 'a' || e.key == 'Left' || e.key == 'ArrowLeft') { key.left = false; }
    if (e.key == 's' || e.key == 'Down' || e.key == 'ArrowDown') { key.down = false; }
    if (e.key == 'd' || e.key == 'Right' || e.key == 'ArrowRight') { key.right = false; }
  }













