function IsPC(){  
  var userAgentInfo = navigator.userAgent;
  var Agents = new Array("Android", "iPhone");  
  var flag = true;  
  for (var v = 0; v < Agents.length; v++) {  
      if (userAgentInfo.indexOf(Agents[v]) > 0) { flag = false; break; }  
  }  
  return flag;  
}

// 设定画布
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

// 设定画布长宽
const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;

var para = document.querySelector("p#count");
var paraT = document.querySelector("p#time")
// 保存小球数量的变量
var ballsNum = 25;
var count = 0;

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

function Shape(x, y, velX, velY, exists){
  this.x = x;
  this.y = y;
  this.velX = velX; // 水平速度
  this.velY = velY; // 垂直速度
  this.exists = exists;
}
// 让Ball继承Shape
function Ball(x, y, velX, velY, exists, color, size){
  Shape.call(this, x, y, velX, velY, exists);
  this.color = color;
  this.size = size;
}

Ball.prototype = Object.create(Shape.prototype);
Ball.prototype.constructor = Ball();

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

//恶魔圈对象
function EvilCircle(x, y, exists, color, size){
  Shape.call(this, x, y, 20, 20, exists);
  this.color = color;
  this.size = size;
}

EvilCircle.prototype = Object.create(Shape.prototype);
EvilCircle.prototype.constructor = EvilCircle();
// 绘制恶魔圈
EvilCircle.prototype.draw = function(){
  ctx.beginPath();
  ctx.lineWidth = 3;
  ctx.strokeStyle = this.color; // stroke应该表示中空的意思，这里如果还是写fillStyle恶魔圈会慢慢消失
  ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
  ctx.stroke(); 
}

EvilCircle.prototype.checkBounds = function(){
  if((this.x + this.size) >= width){  // JS没有逻辑运算符
    this.x -= this.size;  // 到达边界时弹回一些
  }
  if((this.x - this.size) <= 0){
    this.x += this.size;
  }
  if((this.y + this.size) >= height){
    this.y -= this.size;
  }
  if((this.y - this.size) <= 0){
    this.y += this.size;
  }
}

var _x_start,_y_start,_x_move,_y_move,_x_end,_y_end;
EvilCircle.prototype.setControls = function(){
  // e => {} 是箭头函数，类似python中的map/reduce，将输入映射到输出
  if(IsPC()){
    window.onkeydown = e => { // 键盘按下的事件监听器
      if(e.key === 'a')
        this.x -= this.velX;
      else if(e.key === 'd')
        this.x += this.velX;
      else if(e.key === 'w')
        this.y -= this.velY;
      else if(e.key === 's')
        this.y += this.velY;    
    }
  }
  else{
    window.ontouchstart = e => {
      _x_start=e.touches[0].pageX;
      _y_start=e.touches[0].pageY;
      console.log("start",_x_start)
    }
    window.ontouchmove = e => {
      _x_move=e.touches[0].pageX;
      _y_move=e.touches[0].pageY;
      console.log("move",_x_move)
      this.x += (parseFloat(_x_move) - parseFloat(_x_start))/10;
      this.y +=  (parseFloat(_y_move) - parseFloat(_y_start))/10;
      console.log(parseFloat(_x_move)-parseFloat(_x_start));
    }
    console.log(this.x + "," + this.y);
      //阻止浏览器下拉事件
    document.querySelector('body').ontouchmove = event => {event.preventDefault();};
  }
}

EvilCircle.prototype.collisionDetect = function(){
  for(var j=0; j<balls.length; j++){
    if(balls[j].exists){ // 只检测是否与存在的小球碰撞
      var dx = this.x - balls[j].x;
      var dy = this.y - balls[j].y;
      var distance = Math.sqrt(dx*dx + dy*dy); // 原先又笔误了，把+号写成了,
      if(distance < this.size + balls[j].size){
       balls[j].exists = false;
      //  ballsNum -= 1;
      //  para.textContent = para.textContent.replace((ballsNum+1).toString(), ballsNum.toString());
        count--;
        para.textContent = "还剩" + count + "个球"
        if(count === 0){
          var dEnd = new Date();
          paraT.textContent = "共耗时" + Math.floor((dEnd.getTime() - gameStartTime)/1000) + "秒";

        }        
      }
    }
  }
}
// 让小球和恶魔圈运动起来
function loop(){
  ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
  ctx.fillRect(0, 0, width, height);
  while(balls.length < ballsNum){
    ball = new Ball(
      random(0, width),
      random(0, height),
      random(-7, 7),
      random(-7, 7),
      true,
      randomColor(),
      random(10, 20)
    );
    balls.push(ball);
    count++;
    para.textContent = "还剩" + count + "个球";
  }
//  para.textContent = para.textContent.replace("多少", ballsNum.toString());
  for(var i=0; i<balls.length; i++){
    if(balls[i].exists){
      balls[i].draw();
      balls[i].update();
      balls[i].collisionDetect();
    }
  }
  evilCircle.draw();
  evilCircle.checkBounds();
  evilCircle.collisionDetect();
  requestAnimationFrame(loop); // loop作为回调函数被调用
}

evilCircle = new EvilCircle(
  random(0, width),
  random(0, height),
  true,
  "red",
  20
)

evilCircle.setControls(); // 启动恶魔圈的位置监听器
var dStart = new Date();
var gameStartTime = dStart.getTime();
loop();
