/* canvas 태그 */
var canvas = document.querySelector('canvas');
canvas.width = window.innerWidth*0.3;
canvas.height = canvas.width*9/12;
/* canvas context 객체 */
var c = canvas.getContext('2d');

/* 장애물 반지름 지정 */
var radius = 8;
/* 장애물 너비, 높이 */
var obstacleX = radius*2;
var obstacleY = radius*2;
/* 장애물 속도(임시 고정) */
var speed = 4;

function Circle(x, y,speed){
    /* x,y값 초기좌표 */
    this.x = x; 
    this.y = y;
    /* 장애물 이동 속도 조절 */
    this.speed = speed;

    this.draw = function(){
        console.log("draw func");
        c.beginPath();
        c.arc(this.x,100,radius,0,Math.PI*2,false);
        c.fillStyle = 'blue';
        c.fill();
        c.strokeStyle = 'black';
        c.stroke();
    }
    this.update = function(){
        console.log("update func");
        if(this.x+radius > canvas.width || this.x-radius < 0)  
            this.speed = -this.speed;
        this.x+=this.speed;

        this.draw();
    }
}

var circle = new Circle(obstacleX,obstacleY,speed);

var circle = new Circle(obstacleX,obstacleY,1);

function animate(){
    console.log("animate func");
    requestAnimationFrame(animate);
    c.clearRect(0,0,innerWidth,innerHeight);
    circle.update();
}

animate();