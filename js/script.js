// game variables
  var game = {

    bulletInterval: 60 * 0.08,
    bulletSizeMin: 1,
    bulletSizeMax: 3,
    bulletPower: 2,
    bulletSpeed: 30,
    bulletCost: 0.07,
    bulletChargeSpeed: 0.01,
    
    enemyInterval: 60 * 1,
    enemySpeed: 0.2,
    enemySizeMin: 10,
    enemySizeMax: 20,
    enemyDirections: 1, // from 1 to 4 only;
    maxEnemis: 5,

    sparksMin: 30,
    sparksMax: 60,
    sparkSizeMin: 0.5,
    sparkSizeMax: 2.5,

    bombSizeMin: 20,
    bombSizeMax: 60,
    bombCost: 0.04,
    bombChargeSpeed: 0.002,
    bombLoadSpeed: 0.8, // speed of increasing radius

    playing: false,

    alpha: 1,

    play: function () {
      game.playing = true;
      this.reset();
    },

    pause: function () {
      game.playing = false;
      document.exitPointerLock();
      // this.key.left = false;
      // this.key.right = false;
      // this.key.up = false;
      // this.key.down = false;
    },

    mouse: {
      xSpeed: 0,
      ySpeed: 0,
    },

    key: {
      left: false,
      right: false,
      up: false,
      down: false,
      space: false,
    },

    bullets: [],
    enemies: [],
    sparks: [],
    bombs: [],

    score: 0,
    enemiesDefeated: 0,
    remainingBullets: Math.PI*2,
    remainingBomb: Math.PI*2,

    reset: function () {
      this.bullets = [];
      this.enemies = [];
      this.sparks = [];
      this.bombs = [];

      this.score = 0;
      this.enemiesDefeated = 0;

      this.key.left = false;
      this.key.right = false;
      this.key.up = false;
      this.key.down = false;

      this.alpha = 1;
    }

  };






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

      var m = 1.01;

      source.xSpeed = source.xSpeedLast * m;
      source.ySpeed = source.ySpeedLast * m;

      target.xSpeedLast = Math.cos(collisionalAngle) * target.xSpeedFinal + Math.cos(collisionalAngle + Math.PI / 2) * target.ySpeedFinal;
      target.ySpeedLast = Math.sin(collisionalAngle) * target.xSpeedFinal + Math.sin(collisionalAngle + Math.PI / 2) * target.ySpeedFinal;

      target.xSpeed = target.xSpeedLast * m;
      target.ySpeed = target.ySpeedLast * m;
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
    // ct.fillText(`Score: ${Math.floor(game.score)}`, 20, canvasTop.height/2);
    // ct.fillText(`Enemies defeated: ${Math.floor(game.enemiesDefeated)}`, 130, canvasTop.height/2);
    // ct.fillText(`bullets: ${game.remainingBullets}`, 240, canvasTop.height/2);
    ct.textAlign = 'right';
    // ct.fillText('Click to START game..     press Esc to EXIT ', canvas.width - 40, canvasTop.height/2);
  }
  drawText();


  function drawStates() {
    c.beginPath();
    c.fillStyle = '#dadada';
    c.font = '14px tahoma';
    c.textAlign = 'left';
    c.fillText(`Score: ${Math.round(game.score)}`, 10, 20);
  }








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
    this.x += game.mouse.xSpeed;// / (1/this.speed) / 4;
    this.y += game.mouse.ySpeed;// / (1/this.speed) / 4;
    // reset speed mouse to zero
    game.mouse.xSpeed = 0;
    game.mouse.ySpeed = 0;
  },
  
  isOut: function () {
    if (this.x <= 0) { this.x = 1; }
    if (this.x >= canvas.width) { this.x = canvas.width - 1; }
    if (this.y <= 0) { this.y = 1; }
    if (this.y >= canvas.height) { this.y = canvas.height - 1; }
  }

}






























function Bomb() {
  this.x = 0;
  this.y = 0;
  this.radius = game.bombSizeMin;
  this.isLoading = true;
  this.radiusAccel = 0.02;

  this.render = function () {
    this.live();
    if (this.isLoading) {
      this.move();
      this.load();
    }
    this.isHit();
    this.draw();
  };

  this.draw = function () {
    c.save();

    c.beginPath();
    // c.globalCompositeOperation = 'xor';
    c.globalCompositeOperation = 'lighter';
    c.strokeStyle = '#fff';
    c.fillStyle = 'rgba(0,0,255,0.5';
    c.arc(this.x, this.y, this.radius, 0, Math.PI*2);
    c.stroke();
    c.fill();
    c.restore();
      // c.clip();
      // c.strokeStyle = '#0F0';
      // c.arc(this.x, this.y, this.radius, 0, Math.PI*2);
      // c.stroke();
      // c.closePath();
  };

  this.move = function () {
    this.x = player.x;
    this.y = player.y;
  };

  this.load = function () {
    this.radius += game.bombLoadSpeed;
  };

  this.live = function () {
    this.radiusAccel += 0.0005;
    this.radius -= this.radiusAccel;
    if (this.radius <= 1) {
      this.delete();
    }
  },

  this.isHit = function () {
    if (!this.isLoading) {
      var dx;
      var dy;
      var distance;
      for (enemy of game.enemies) {
        dx = (this.x - enemy.x);
        dy = (this.y - enemy.y);
        distance = Math.sqrt(dx*dx+dy*dy);
        if (enemy.radius < this.radius) {
          if (distance < this.radius + enemy.radius) {
            enemy.damage(this.radius/100);
            enemy.setTarget(this);
          }
        } else {
          enemy.setTarget(player);
        }
      }
    }
  },

  this.delete = function () {
    game.bombs.splice(game.bombs.indexOf(this), 1);
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
  life: 20,
  hurt: 1,
  bullets: game.remainingBullets,
  bomb: game.remainingBomb,
  loadingBomb: null,
  
  render: function () {
  	this.hurtEffect();
    this.calcBullets();
    this.isDead();
    this.isOut();
    this.bombBar();
    this.move();
    this.fire();
    this.draw();
  },
  
  draw: function () {
    c.save();

    // point to mouse
    c.translate(this.x, this.y);
    c.rotate(this.angel);
    c.translate(this.x*-1, this.y*-1);

    // draw fire
    c.beginPath();
    c.fillStyle = "#fff";
    c.moveTo(this.x, this.y - this.radius + 1);
    c.lineTo(this.x-this.radius-(this.fireCounter*3), this.y);
    c.lineTo(this.x, this.y + this.radius - 1);
    c.fill();

    // draw main circle
    c.beginPath();
    c.fillStyle = "#fff";
    c.arc(this.x, this.y, this.radius, 0, Math.PI*2);
    c.fill();

    c.lineWidth = 5;

    // draw health radial bar
    c.beginPath();
    c.strokeStyle = '#a00';
    c.arc(this.x, this.y, this.radius, 0, (Math.PI*2)*(this.life/this.radius));
    c.stroke();

    // // draw bullets radial
    c.beginPath();
    c.strokeStyle = '#555';
    c.arc(this.x, this.y, this.radius - 6, 0, this.bullets);
    c.stroke();

    // draw bomb radial bar
    c.beginPath();
    c.strokeStyle = '#005';
    c.arc(this.x, this.y, this.radius - 13, 0, this.bomb);
    c.stroke();



    c.restore();
  },
  
  fire: function () {
    this.fireCounter -= this.fireSpeed;
    if (this.fireCounter < 0) { this.fireCounter = this.fireDefault; }
  },

  calcBullets: function () {
    if (game.remainingBullets <= game.bulletCost) {
      this.bullets = game.bulletCost;
    } else {
      this.bullets = game.remainingBullets;
    }
  },

  move: function () {
    // get angel between target and player
    this.angel = this.angelTo(this, target);
    
    // change speed based on keyboard keys
    if (Math.abs(this.ySpeed) < this.maxSpeed) {
      if (game.key.up) { this.ySpeed -= this.accel; }
      if (game.key.down) { this.ySpeed += this.accel; }  
    }
    if (Math.abs(this.xSpeed) < this.maxSpeed) {
      if (game.key.left) { this.xSpeed -= this.accel; }
      if (game.key.right) { this.xSpeed += this.accel; }      
    }
    
    // fraction
    this.xSpeed *= this.fraction;
    this.ySpeed *= this.fraction;
    
    // movement
    this.x += this.xSpeed;
    this.y += this.ySpeed;

    // count dash time when needed
    data.xSpeed = this.xSpeed;
    data.ySpeed = this.ySpeed;
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
  },

  bloodScreen: function () {
    c.save();
    c.beginPath();
    c.fillStyle = 'rgba(255,0,0,0.5)';
    c.fillRect(0, 0, canvas.width, canvas.height);
    c.restore();    
  },

  dash: function () {
    this.xSpeed = this.dashSpeed * Math.cos(this.angel+Math.PI);
    this.ySpeed = this.dashSpeed * Math.sin(this.angel+Math.PI);
  },

  bombBar: function () {
    if (this.loadingBomb instanceof Bomb) {
      if (this.bomb > 0) {
        this.bomb -= game.bombCost;
      } else if (this.bomb <= 0) {
        this.bomb = 0;
        this.bombRelease();
      }
    } else {
      if (this.bomb < Math.PI*2) {
        this.bomb += game.bombChargeSpeed;
      } else {
        this.bomb = Math.PI*2;
      }
    }
  },

  bombAdd: function () {
    this.loadingBomb = new Bomb();
    game.bombs.push(this.loadingBomb);
    this.bombIsLoading = true;
  },

  bombRelease: function () {
    if (this.loadingBomb) {
      this.bombIsLoading = false;
      this.loadingBomb.isLoading = false;
      this.loadingBomb = null;
    }
  },

  hurtEffect: function () {
  	this.hurt = this.life/this.radius + 0.25;
  	if (this.hurt > 0 && this.hurt < 1) { game.alpha = this.hurt; }
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
    game.sparks.splice(game.sparks.indexOf(this), 1);
  };

}














function Bullet() {
  this.x = player.x;
  this.y = player.y;
  this.speed = game.bulletSpeed;
  this.xSpeed = 0;
  this.ySpeed = 0;
  this.radius = Math.random() * (game.bulletSizeMax-game.bulletSizeMin) + game.bulletSizeMin;
  this.angel = Math.atan2((target.y - player.y), (target.x - player.x));
  this.sparkCount = Math.floor(Math.random() * (game.sparksMax-game.sparksMin) + game.sparksMin);
  this.power = game.bulletPower*this.radius;
  
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
    for (enemy of game.enemies) {
      dx = this.x - enemy.x;
      dy = this.y - enemy.y;
      distance = Math.sqrt(dx*dx + dy*dy);
      if (distance < this.radius + enemy.radius) {
        this.spark();
        this.delete();
        enemy.damage(this.power);
        this.flashScreen();
      }      
    }
  };

  this.flashScreen = function () {
    c.save();
    c.beginPath();
    c.fillStyle = 'rgba(255,255,255,0.2)';
    c.fillRect(0, 0, canvas.width, canvas.height);
    c.restore();    
  };


  this.spark = function () {
      for(var i = 0; i < this.sparkCount; i++) {
        game.sparks.push(new Spark(this.x, this.y));
      }
  };
  
  this.delete = function () {
    game.bullets.splice(game.bullets.indexOf(this), 1);
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
  this.color = '#f00';

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
    c.fillStyle = this.color;
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
      this.spark();
      player.damage();
      player.life -= this.radius/10;
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
    for (enemy of game.enemies) {
      if (enemy == this) { continue; }
      collision(this, enemy);
    }
  }
  
  this.followPlayer = function () {
    this.angel = Math.atan2((this.target.y - this.y), (this.target.x - this.x));
  }
  
  this.setTarget = function (target) {
    this.target = target;
  }

  this.spark = function () {
      for(var i = 0; i < this.sparkCount; i++) {
        game.sparks.push(new Spark(this.x, this.y, '#f30'));
      }
  }
  
  this.damage = function (power) {
    this.life -= power;
    game.score += power;
  }

  this.delete = function () {
    game.enemies.splice(game.enemies.indexOf(this), 1);
    game.enemiesDefeated++;
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

      // c.clearRect(0, 0, canvas.width, canvas.height);
      c.save();
      c.fillStyle = `rgba(0,0,0,${game.alpha})`;
      c.fillRect(0,0,canvas.width,canvas.height);
      c.restore();

      // draw player
      player.render();

      // draw target
      target.render();

      // add bullets to array
      if (game.key.space) {
        if (game.remainingBullets > 0) {
          bulletIntervalCounter++;
          if (bulletIntervalCounter >= game.bulletInterval) {
            game.bullets.push(new Bullet());
            bulletIntervalCounter = 0;
            game.remainingBullets -= game.bulletCost;
          }
        } else {
          game.key.space = false;
        }
      } else {
        bulletIntervalCounter = 0;
        if (game.remainingBullets < Math.PI*2) {
          game.remainingBullets += game.bulletChargeSpeed;
        }
      }

      // draw bullets
      for (bullet of game.bullets) {
        bullet.render();
      }

      // add enemies to array
      enemyIntervalCounter++;
      if (enemyIntervalCounter >= game.enemyInterval && game.enemies.length < game.maxEnemis) {
        enemyIntervalCounter = 0;
        game.enemies.push(new Enemy());
      }

      // draw enemies
      for (enemy of game.enemies) {
        enemy.render();
      }


      // draw sparks
      for (spark of game.sparks) {
        spark.render();
      }

      // draw bombs
      for (bomb of game.bombs) {
        bomb.render();
      }

      // draw text
      drawStates();

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
      document.addEventListener('mouseup', mouseUpHandler, false);
      
      document.addEventListener('keydown', keydownHandler, false);
      document.addEventListener('keyup', keyupHandler, false);
      
      if (!game.playing) { game.play(); }
    } else {
      console.log('The pointer lock status is now unlocked');
      document.removeEventListener("mousemove", updatePosition, false);
      document.removeEventListener('mousedown', mouseDownHandler, false);
      document.removeEventListener('mouseup', mouseUpHandler, false);
      
      document.removeEventListener('keydown', keydownHandler, false);
      document.removeEventListener('keyup', keyupHandler, false);

      if (game.playing) { game.pause(); }
    }
  }

  function updatePosition(e) {
    game.mouse.xSpeed += e.movementX;
    game.mouse.ySpeed += e.movementY;
  }

  function mouseDownHandler(e) {
    if (e.button === 0) {
      player.dash();
    }
    if (e.button === 2) {
      player.bombAdd();
    }
  }

  function mouseUpHandler(e) {
    if (e.button === 2) {
      player.bombRelease();
    }
  }


  function keydownHandler(e) {
    if (e.key == 'w' || e.key == 'Up' || e.key == 'ArrowUp') { game.key.up = true; }
    if (e.key == 'a' || e.key == 'Left' || e.key == 'ArrowLeft') { game.key.left = true; }
    if (e.key == 's' || e.key == 'Down' || e.key == 'ArrowDown') { game.key.down = true; }
    if (e.key == 'd' || e.key == 'Right' || e.key == 'ArrowRight') { game.key.right = true; }
    if (e.key == ' ') { if (game.key.space) { game.key.space = false; } else { game.key.space = true; } }
  }

  function keyupHandler(e) {
    if (e.key == 'w' || e.key == 'Up' || e.key == 'ArrowUp') { game.key.up = false; }
    if (e.key == 'a' || e.key == 'Left' || e.key == 'ArrowLeft') { game.key.left = false; }
    if (e.key == 's' || e.key == 'Down' || e.key == 'ArrowDown') { game.key.down = false; }
    if (e.key == 'd' || e.key == 'Right' || e.key == 'ArrowRight') { game.key.right = false; }
  }













