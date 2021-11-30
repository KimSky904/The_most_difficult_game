/* canvas 태그 */
var canvas = document.querySelector('canvas');
canvas.width = window.innerWidth*0.3;
canvas.height = canvas.width*9/12;
/* canvas context 객체 */
var c = canvas.getContext('2d');
/* 음악 재생 */
var audio = new Audio('music1.mp3');
audio.volume = 0.8;
let audioPlay = false;



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
var circleX;
var circleY;
var squareX;
var squareY;
var dx=0;
var dy=0;
let deathCount = 0;
/* 플레이 정보 */
let mapp,player,circle;
mapLevel = 1;
setLevel();


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
function soundClicked(){
    let img = document.getElementById('sound');
    if(audioPlay){
        img.src = "./image/volume-on.png";
        audio.play();
        audioPlay = false;
    } else {
        img.src = "./image/volume-off.png";
        audio.pause();
        audioPlay = true;
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
        } else if(this.direction == "left"){
            if(this.x > this.startX || this.x < this.finishX) //시작점과 끝점 사이를 이동
                this.speed = -this.speed;
            this.x += this.speed;
        } else if(this.direction == "up"){
            if(this.y > this.startY || this.y < this.finishY) //시작점과 끝점 사이를 이동
                this.speed = -this.speed;
            this.y += this.speed;
        } else if(this.direction == "down"){
            if(this.y < this.startY || this.y > this.finishY) //시작점과 끝점 사이를 이동
                this.speed = -this.speed;
            this.y += this.speed;
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

/* 플레이어 클래스 */
function Square(startX, startY) {
    /* 플레이어 크기 */
    this.width = 12;
    this.height = 12;
    /* 시작 위치 */
    this.x = startX;
    this.y = startY;

    this.move = function() {
        this.WallReachCheck();  //가장자리벽 충돌처리(플레이어이동불가처리)
        //this.CircleReackCheck();
        //장애물 충돌처리(일단 x좌표만 비교, 충돌시 시작지점으로 강제이동)
        if ((this.x + 12 == circleX || this.x - 12 == circleX) ) {
            this.x = 85;
            this.y = 200;
        }
        else {  //충돌하지 않았을때 플레이어 이동
            this.x += dx;
            this.y += dy;
        }
        
    }  
    this.WallReachCheck = function() {
        if (this.x < 23 + 12) {
            this.x = 23 + 12;
        }
        else if (this.x > 542 - 12) {
            this.x = 542 - 12;
        }
        if (this.y < 117 + 12) {
            this.y = 117 + 12;
        }
        else if (this.y > 303 - 12) {
            this.y = 303 - 12;
        }
    }
    this.CircleReackCheck = function() {
        
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

/* 맵 클래스 */
function Mapp(mapLevel,startX,startY,arrived1X,arrived1Y,arrived2X,arrived2Y){
    /* 맵 정보 */
    this.mapLevel = mapLevel;
    /* 사용자 출발 좌표 */
    this.startX = startX;
    this.startY = startY;
    /* 도착 인식 좌표 */
    this.arrived1X = arrived1X;
    this.arrived1Y = arrived1Y;
    this.arrived2X = arrived2X;
    this.arrived2Y = arrived2Y;
    /* 장애물 정보 */
    this.obstacle = [];
    /* 다음 단계 */
    this.checkArrived = function(squareX,squareY){
        if((squareX>arrived1X||squareX>arrived2X)&&(squareY>arrived1Y||squareY>arrived2Y)){
            alert("도착함");
            startNextLevel(mapLevel);
        } 
    }
}


//각 레벨에 맞는 맵정보, 장애물 생성
function setLevel(){
    c.clearRect(0,0,canvas.width,canvas.height);
    if(mapLevel == 1){
        mapp = new Mapp(1,72.5,200,437,119.5,437,146.5);
        mapp.obstacle.push(new Circle(170+radius, 180, 3, 418-radius, 180,"right"));
        mapp.obstacle.push(new Circle(418-radius, 180+blockSize*1, 3, 170+radius,180+blockSize*1,"left"));
        mapp.obstacle.push(new Circle(170+radius, 180+blockSize*2, 3, 418-radius,180+blockSize*2,"right"));
        mapp.obstacle.push(new Circle(418-radius, 180+blockSize*3, 3, 170+radius,180+blockSize*3,"left"));
    }
    if(mapLevel == 2){
        mapp = new Mapp(2,99.5,210,410,173,410,227);
        mapp.obstacle.push(new Circle(145+18, 259+30, 3, 145+15, 124+15 ,"up"));
        mapp.obstacle.push(new Circle(172+18, 124+15, 3, 172+15, 259+30,"down"));
        mapp.obstacle.push(new Circle(199+18, 259+30, 3, 199+15, 124+15,"up"));
        mapp.obstacle.push(new Circle(226+21, 124+15, 3, 226+15, 259+30,"down"));
        mapp.obstacle.push(new Circle(253+22, 259+30, 3, 253+15, 124+15,"up"));
        mapp.obstacle.push(new Circle(280+23, 124+15, 3, 280+15, 259+30,"down"));
        mapp.obstacle.push(new Circle(307+24, 259+30, 3, 307+15, 124+15,"up"));
        mapp.obstacle.push(new Circle(334+25, 124+15, 3, 334+15, 259+30,"down"));
        mapp.obstacle.push(new Circle(361+26, 259+30, 3, 361+15, 124+15,"up"));
        mapp.obstacle.push(new Circle(388+27, 124+15, 3, 388+15, 259+30,"down"));
    }
    if(mapLevel == 3){
        mapp = new Mapp(3,100,340,424,295,478,295);
        mapp.obstacle.push(new Circle(100+18, 268+30, 2, 100, 214+30 ,"up"));
        mapp.obstacle.push(new Circle(154+21, 214+30, 2, 199+15, 124+60,"up"));
        mapp.obstacle.push(new Circle(208+25, 124+70, 2, 253+15, 124,"up"));
        mapp.obstacle.push(new Circle(208+25+27+27, 124+12, 2, 253+15, 124-60,"up"));
        mapp.obstacle.push(new Circle(208+25, 124+70, 2, 253+15, 124,"up"));
        mapp.obstacle.push(new Circle(316+27, 124+70, 2, 316,  124,"up"));
        mapp.obstacle.push(new Circle(370+32, 214+30, 2, 370, 124+60,"up"));
        mapp.obstacle.push(new Circle(424+36, 268+30, 2, 424, 214+30,"up"));
    }
    if(mapLevel == 4){
        mapp = new Mapp(4,248.5,106,316,133,343,133);
        mapp.obstacle.push(new Circle(170+radius, 180, 3, 418-radius, 180,"right"));
        mapp.obstacle.push(new Circle(418-radius, 180+blockSize*1, 3, 170+radius,180+blockSize*1,"left"));
        mapp.obstacle.push(new Circle(170+radius, 180+blockSize*2, 3, 418-radius,180+blockSize*2,"right"));
        mapp.obstacle.push(new Circle(418-radius, 180+blockSize*3, 3, 170+radius,180+blockSize*3,"left"));
        mapp.obstacle.push(new Circle(170+radius, 180+blockSize*4, 3, 418-radius,180+blockSize*4,"right"));
        mapp.obstacle.push(new Circle(418-radius, 180+blockSize*5, 3, 170+radius,180+blockSize*5,"left"));
    }
    player = new Square(mapp.startX,mapp.startY);
    changeUserInfo(mapLevel,deathCount);
    changeMap(mapLevel);
}

/* 애니메이션 */
function animate(){
    //장애물 이동범위 초기화
    for(let i=0;i<mapp.obstacle.length;i++){
        c.clearRect(mapp.obstacle[i].x-radius-3,mapp.obstacle[i].y-radius-5,blockSize-2,blockSize-3);
    }
    //장애물 draw
    for(let i=0;i<mapp.obstacle.length;i++){
        mapp.obstacle[i].draw();
    }
    //플레이어 이동 후 그리기
    c.clearRect(player.x-0.5,player.y-0.5,player.width+1,player.height+1);
    player.move();
    //도착지점에 도달하면 맵 변경
    if(mapLevel==1){
        if(player.x>mapp.arrived1X) {
            mapLevel = 2;
            setLevel();
        }
    } else if(mapLevel==2){
        if(player.x>mapp.arrived1X) {
            mapLevel = 3;
            setLevel();
        }
    } else if(mapLevel==3){
        if(player.x>mapp.arrived1X) {
            mapLevel = 4;
            setLevel();
        }
    }
    player.draw();
    requestAnimationFrame(animate);
}
animate();