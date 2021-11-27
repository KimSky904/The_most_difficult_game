/* canvas 태그 */
var canvas = document.querySelector('canvas');
canvas.width = window.innerWidth*0.3;
canvas.height = canvas.width*9/12;
/* canvas context 객체 */
var c = canvas.getContext('2d');


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
var keycode;
var dx=0;
var dy=0;

/* 1. draw map line */
function drawFirstLine(startX, startY, finishX, finishY){
    c.beginPath();
    c.moveTo(startX,startY);
    c.lineTo(finishX,finishY);
    c.strokeStyle = 'black';
    c.lineWidth = 2;
    c.lineCap = "square"
    c.stroke();
    /* 마지막 line 끝 좌표 저장 */
    lastX = finishX;
    lastY = finishY;
}
function drawNextLine(finishX, finishY){
    c.moveTo(lastX,lastY);
    c.lineTo(finishX,finishY);
    c.strokeStyle = 'black';
    c.lineWidth = 2;
    c.lineCap = "square"
    c.stroke();
    /* 마지막 line 끝 좌표 저장 */
    lastX = finishX;
    lastY = finishY;
}


/* 2. 출발-도착 영역 타일(div) 생성하기 */
function drawGreenRoom(startX, startY,width,height) {
    //id는 랜덤값으로, class는 지울 수 있도록 동일한 값으로 주기
    let randomIdValue = Math.random();
    var area = document.createElement('div');
    area.innerHTML = `<div class='greenBox' id='${randomIdValue}'> </div> `;
    document.getElementById('mapBox').appendChild(area);
    var box = document.getElementById(`${randomIdValue}`); 
    box.style.top = startY-10+canvas.getBoundingClientRect().top + "px";   
    box.style.left = startX+canvas.getBoundingClientRect().left + "px";   
    box.style.width = width-3 + "px";
    box.style.height = height-12 + "px";
    console.log(canvas.getBoundingClientRect().top);
    console.log(canvas.getBoundingClientRect().left); 
}
/* 3. 체크 타일 채우기 */
function drawCheckBoxRoom(startX, startY) {
    //id는 랜덤값으로, class는 지울 수 있도록 동일한 값으로 주기
    let randomIdValue = Math.random();
    var area = document.createElement('div');
    area.innerHTML = `<div class='checkBox' id='${randomIdValue}'> </div> `;
    document.getElementById('mapBox').appendChild(area);
    var box = document.getElementById(`${randomIdValue}`); 
    box.style.top = startY+5+canvas.getBoundingClientRect().top + "px";   
    box.style.left = startX-6+canvas.getBoundingClientRect().left + "px";   
    box.style.width = blockSize*2 + "px";
    box.style.height = blockSize + "px";
}
function drawMap(level, imagePath){
    /* 기존 맵 배경 지우기 */

    /* 신규 맵 배경 추가 */
    let mapArea = document.createElement('div');
    mapArea.innerHTML = `<img id='mapImage' src='${imagePath}'> </div> `;

}
/* 4.맵 지우기 */
function deleteMap(){
    c.clearRect(0,0,canvas.width,canvas.height);
    document.getElementById("mapBox").removeChild();
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
    /* 시작 위치 */
    this.x = startX;
    this.y = startY;
    this.move = function() {
        this.x+= dx;
        this.y+= dy;
    }
    this.draw = function() {
        c.drawImage(imgChar,this.x,this.y,12,12);
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



/* 출발-도착 영역 타일(div) 생성 */
drawMap(1,"../image/stage1.png");
// drawGreenRoom(50,140,blockSize*3,blockSize*6);
// drawGreenRoom(435,140,blockSize*3,blockSize*6);
// drawCheckBoxRoom(50+blockSize*3,140+blockSize*4);
// drawCheckBoxRoom(50+14+blockSize*12,123);
//drawCheckBoxContinuedRoom(50+blockSize*4,123+blockSize,blockSize*10,blockSize*4);
/* 맵 line 그리기 */
// drawFirstLine(50,140,50,140+blockSize*6);
// drawNextLine(lastX+(blockSize*5),lastY); //오른쪽으로 이동
// drawNextLine(lastX,lastY-(blockSize*1)); //위쪽으로 이동
// drawNextLine(lastX+(blockSize*9),lastY); //오른쪽
// drawNextLine(lastX,lastY-(blockSize*4)); //위쪽
// drawNextLine(lastX+(blockSize*1),lastY); //오른쪽
// drawNextLine(lastX,lastY+(blockSize*5)); //아래쪽
// drawNextLine(lastX+(blockSize*3),lastY); //오른쪽
// drawNextLine(lastX,lastY-(blockSize*6)); //위쪽
// drawNextLine(lastX-(blockSize*5),lastY-1); //왼쪽
// drawNextLine(lastX,lastY+(blockSize*1)); //아래쪽
// drawNextLine(lastX-(blockSize*9),lastY); //왼쪽
// drawNextLine(lastX,lastY+(blockSize*4)); //아래쪽
// drawNextLine(lastX-(blockSize*1),lastY); //왼쪽
// drawNextLine(lastX,lastY-(blockSize*5)); //위쪽
// drawNextLine(lastX-(blockSize*3),lastY); //왼쪽
c.lineWidth = 1;



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
    square.move();
    c.clearRect(square.x,square.y,blockSize-5,blockSize-5);
    square.draw();

    requestAnimationFrame(animate);

    if(value==1) deleteMap();
}
animate();