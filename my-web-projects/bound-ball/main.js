// 设定画布
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

// 设定画布长宽
const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;

// 生成随机数的函数
function random(min,max) {
  return Math.floor(Math.random()*(max-min)) + min;
}

// 生成随机颜色的函数
function randomColor() {
  return 'rgb(' +
         random(0, 255) + ', ' +
         random(0, 255) + ', ' +
         random(0, 255) + ')';
}

function Shape(x, y, velX, velY){
  this.x = x;
  this.y = y;
  this.velX = velX; // 水平速度
  this.velY = velY; // 垂直速度
}

function Ball(x, y, velX, velY, color, size){
  this.x = x;
  this.y = y;
  this.velX = velX; // 水平速度
  this.velY = velY; // 垂直速度
  this.color = color;
  this.size = size;
}

// 绘制小球
Ball.prototype.draw = function(){
  ctx.beginPath();
  ctx.fillStyle = this.color;
  ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
  ctx.fill();
}

// 更新小球位置
Ball.prototype.update = function(){
  if((this.x + this.size) >= width){  // JS没有逻辑运算符
    this.velX = -(this.velX);
  }
  if((this.x - this.size) <= 0){
    this.velX = -(this.velX);
  }
  if((this.y + this.size) >= height){
    this.velY = -(this.velY);
  }
  if((this.y - this.size) <= 0){
    this.velY = -(this.velY);
  }
  this.x += this.velX; // 原先笔误，写成了this.velY
  this.y += this.velY;
}


var balls = [];

// 给小球添加碰撞检测
Ball.prototype.collisionDetect = function(){
  for(var j=0; j<balls.length; j++){
    if(!(this=== balls[j])){ // 计算当前小球与其它小球的欧式距离
      var dx = this.x - balls[j].x;
      var dy = this.y - balls[j].y;
      var distance = Math.sqrt(dx*dx + dy*dy); // 原先又笔误了，把+号写成了,
      if(distance < this.size + balls[j].size){
       balls[j].color = this.color  = randomColor();
      }
    }
  }
}

// 让小球运动起来
function loop(){
  ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
  ctx.fillRect(0, 0, width, height);
  while(balls.length < 5){
    ball = new Ball(
      random(0, width),
      random(0, height),
      random(-7, 7),
      random(-7, 7),
      randomColor(),
      random(10, 20)
    );
    balls.push(ball);
  }
  for(var i=0; i<balls.length; i++){
    balls[i].draw();
    balls[i].update();
    balls[i].collisionDetect();
  }
  requestAnimationFrame(loop);
}

loop();