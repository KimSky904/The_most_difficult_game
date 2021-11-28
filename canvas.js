/* canvas 태그 */
var canvas = document.querySelector('canvas');
canvas.width = window.innerWidth*0.3;
canvas.height = canvas.width*9/12;
/* canvas context 객체 */
var c = canvas.getContext('2d');
/* 음악 재생 */
var audio = new Audio('music1.mp3');
audio.play();



/* 장애물 반지름 지정 */
let radius = 8;
/* 장애물 너비, 높이 */
let obstacleX = radius*2;
let obstacleY = radius*2;
/* 블럭 크기 */
let blockSize = 27;
let checkSize = 25;
/* 라인 마침점 좌표 */
let lastX,lastY;
/* 플레이어 이미지, 플레이어 키보드 조작값, 좌표 */ 
var imgChar= new Image();
imgChar.src="image/square.png";
console.log(imgChar.style.width);
console.log(imgChar.style.height);
var keycode;
var dx=0;
var dy=0;

/* 맵 정보 */
let mapLevel = 1;


/* 0. 개발자 정보 링크 div */
let devInfo = document.getElementById('infoBar'); 
devInfo.style.top = canvas.getBoundingClientRect().top + canvas.height - 90+"px";   
devInfo.style.left = canvas.getBoundingClientRect().left+1 + "px";

/* 1. 맵 배경 이미지 생성하기 */
function changeMap(mapLevel){
    let img = document.getElementById('mapImage');
    img.src = "./image/stage" +mapLevel+".png";
    img.style.zIndex = 0;
}
function howPlayClicked(){
    let img = document.getElementById('mapImage');
    if(img.style.zIndex==2){
        changeMap(mapLevel);
    } else {
        img.src = "./image/howToPlay.png";
        img.style.zIndex = 2;
    }
}
function devInfoClicked(){
    let img = document.getElementById('mapImage');
    if(img.style.zIndex==3){
        changeMap(mapLevel);
    } else {
        img.src = "./image/devInfo.png";
        img.style.zIndex = 3;
    }
}
/* 2. 사용자 상태 정보 생성하기 */
function changeUserInfo(mapLevel, deathCount) {
    let userInfo = document.getElementById('progressBar'); 
    let menu = userInfo.childNodes[1]; //menu
    let map = userInfo.childNodes[3]; //map level
    let deaths = userInfo.childNodes[5]; //deaths
    map.innerText = mapLevel+"/4";
    deaths.innerText = "DEATHS : "+deathCount;
    userInfo.style.top = canvas.getBoundingClientRect().top + "px";   
    userInfo.style.left = canvas.getBoundingClientRect().left+1 + "px";   
    userInfo.style.width = canvas.style.width + "px";
    console.log(userInfo.style.top);
    console.log(userInfo.style.left);
    console.log(userInfo.style.width);
}


/* 장애물 클래스 */
function Circle(startX, startY,speed,finishX,finishY,leftRight){
    /* 장애물 속도(임시 고정) */
    this.speed = speed;
    /* 왼쪽방향 or 오른쪽방향 */
    this.direction = leftRight; 
    /* x,y값 현재좌표 */
    this.x = startX;
    this.y = startY;
    /* 장애물 이동 속도 조절 */
    this.speed = speed;
    /* x,y값 초기좌표 */
    this.startX = startX; 
    this.startY = startY;
    /* x,y값 끝좌표 */
    this.finishX = finishX; 
    this.finishY = finishY;
    /* 그리기 - 애니메이션 */
    this.draw = function(){
        //console.log("update func");
        if(this.direction == "right"){
            if(this.x < this.startX || this.x > this.finishX)  //시작점과 끝점 사이를 이동
                this.speed = -this.speed;
            this.x += this.speed;
        } else {
            if(this.x > this.startX || this.x < this.finishX) //시작점과 끝점 사이를 이동
                this.speed = -this.speed;
            this.x += this.speed;
        }
        //console.log("draw func");
        c.beginPath();
        c.arc(this.x,this.y,radius,0,Math.PI*2,false);
        c.fillStyle = 'yellow';
        c.fill();
        c.strokeStyle = 'black';
        c.stroke();
    }
}
/* 맵 클래스 */
function Map(){
    /* 맵 정보 */
    let mapNumber;
    /* 사용자 출발 좌표 */
    let startX,startY;
    /* 도착 인식 좌표 */
    let arrivedX, arrivedY;
    /* 장애물 정보 */
}
/* 플레이어 클래스 */
function Square(startX, startY) {
    /* 플레이어 크기 */
    this.width = 12;
    this.height = 12;
    /* 시작 위치 */
    this.x = startX;
    this.y = startY;
    this.move = function() {
        this.x+= dx;
        this.y+= dy;
    }
    this.draw = function() {
        c.drawImage(imgChar,this.x,this.y,this.width,this.height);
    }
}

function keydown(){
    //눌러진 key의 코드값
    keycode=event.keyCode;
    switch(keycode){
        case 37: dx=-1; break; //left
        case 38: dy=-1; break; //up
        case 39: dx=1; break; //right
        case 40: dy=1; break; //down
    }
}
function keyup(){
    //떨어진 key의 코드값
    keycode=event.keyCode;
    switch(keycode){
        case 37: 
        case 39: dx=0; break;
        case 38:
        case 40: dy=0; break;
    }
}



/* 다중 장애물 생성 */
let circle = [new Circle(170+radius, 180, 3, 418-radius, 180,"right")];
circle.push(new Circle(418-radius, 180+blockSize*1, 3, 170+radius,180+blockSize*1,"left"));
circle.push(new Circle(170+radius, 180+blockSize*2, 3, 418-radius,180+blockSize*2,"right"));
circle.push(new Circle(418-radius, 180+blockSize*3, 3, 170+radius,180+blockSize*3,"left"));

/* 플레이어 생성 */
let square = new Square(85, 200);
let value=0;
/* 애니메이션 */
function animate(){
    //console.log("animate func");
    //장애물 이동범위 초기화
    for(let i=0;i<circle.length;i++){
        c.clearRect(circle[i].x-radius-3,circle[i].y-radius-5,blockSize-2,blockSize-3);
    }
    //장애물 draw
    for(let i=0;i<circle.length;i++){
        circle[i].draw();
    }
    //플레이어 이동 후 그리기
    c.clearRect(square.x-0.5,square.y-0.5,square.width+1,square.height+1);
    square.move();
    square.draw();

    requestAnimationFrame(animate);

    if(value==1) deleteMap();
}
animate();