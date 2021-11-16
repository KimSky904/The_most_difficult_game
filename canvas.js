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
/* 장애물 속도(임시 고정) */
let speed = 4;
/* 블럭 크기 */
let blockSize = 27;
/* 라인 마침점 좌표 */
let lastX,lastY;
let count = 0;



//참고! 모든 좌표는 레벨 1을 기준으로 하고있음



/* draw inner map */
function Line(startX, startY, finishX, finishY){
    /* x,y값 출발좌표 */
    this.startX = startX;
    this. startY = startY;
    /* x,y값 도착좌표 */
    this.finishX = finishX;
    this.finishY = finishY;
    /* draw */
    this.draw = function(){
        console.log("line draw func");
        c.beginPath();
        c.moveTo(this.startX,this.startY);
        c.lineTo(this.finishX,this.finishY);
        c.strokeStyle = 'black';
        c.lineWidth = 2;
        c.stroke();
    }
}        



/* 1. draw map line */ //+) beginPath() 를 호출하지 않으면 이어지는 line 생성됨
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
function drawNextLine(startX, startY, finishX, finishY){
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

/* 2. draw green room */
function drawGreenRoom(startX, startY, finishX, finishY){
    ++count;
    if(count%2==0){
        c.fillStyle = 'white';
    }
    else {
        c.fillStyle = 'rgba(200, 206, 255, 0.89)';
    }
    //직사각형 범위 전체 적용
    c.fillRect(startX,startY,blockSize,blockSize);
}
/* 3. draw checkbox room */
function drawCheckBoxRoom(){ 

}


/* 장애물 클래스 */
function Circle(startX, startY,speed,finishX,finishY){
    /* x,y값 현재좌표 */
    this.x = startX;
    this.y = startY;
    /* x,y값 초기좌표 */
    this.startX = startX; 
    this.startY = startY;
    /* x,y값 끝좌표 */
    this.finishX = finishX; 
    this.finishY = finishY;
    /* 장애물 이동 속도 조절 */
    this.speed = speed;
    /* 그리기 - 애니메이션 */
    this.draw = function(){
        console.log("update func");
        if(this.x+radius > this.startX || this.x-radius < this.finishX)  //시작점과 끝점 사이를 이동
            this.speed = -this.speed;
        this.x+=this.speed;

        console.log("draw func");
        c.beginPath();
        c.arc(this.x,this.y,radius,0,Math.PI*2,false);
        c.fillStyle = 'yellow';
        c.fill();
        c.strokeStyle = 'black';
        c.stroke();
    }
}

/* lv1 draw lines */
// 시작 좌표 : 50,140
drawFirstLine(50,140,50,300);
drawNextLine(lastX,lastY,lastX+(blockSize*5),lastY); //오른쪽으로 이동
drawNextLine(lastX,lastY,lastX,lastY-(blockSize*1)); //위쪽으로 이동
drawNextLine(lastX,lastY,lastX+(blockSize*9),lastY); //오른쪽
drawNextLine(lastX,lastY,lastX,lastY-(blockSize*4)); //위쪽
drawNextLine(lastX,lastY,lastX+(blockSize*1),lastY); //오른쪽
drawNextLine(lastX,lastY,lastX,lastY+(blockSize*5)); //아래쪽
drawNextLine(lastX,lastY,lastX+(blockSize*3),lastY); //오른쪽
drawNextLine(lastX,lastY,lastX,lastY-(blockSize*6)); //위쪽
drawNextLine(lastX,lastY,lastX-(blockSize*5),lastY); //왼쪽
drawNextLine(lastX,lastY,lastX,lastY+(blockSize*1)); //아래쪽
drawNextLine(lastX,lastY,lastX-(blockSize*9),lastY); //왼쪽
drawNextLine(lastX,lastY,lastX,lastY+(blockSize*4)); //아래쪽
drawNextLine(lastX,lastY,lastX-(blockSize*1),lastY); //왼쪽
drawNextLine(lastX,lastY,lastX,lastY-(blockSize*5)); //위쪽
drawNextLine(lastX,lastY,lastX-(blockSize*3),lastY); //왼쪽
c.lineWidth = 1;

/* 다중 장애물 생성 */
let circle = [new Circle(170, 180, speed,350,180)];
//circle.push(new Circle(170+blockSize*8, 180+blockSize, speed));
//circle.push(new Circle(170, 180, speed));
//circle.push(new Circle(170, 180, speed));

function animate(){
    console.log("animate func");
    //장애물 이동경로만 다시 그림
    for(let i=0;i<circle.length;i++){
        c.clearRect(circle[i].x,circle[i].y,blockSize,blockSize);
    }

    circle[0].draw();

//    for(let i=0; i<4; i++){
//        circle[i].draw();
//    }
    requestAnimationFrame(animate);
}

animate();