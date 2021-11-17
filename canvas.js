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
/* 라인 마침점 좌표 */
let lastX,lastY;




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

/* 2. 출발-도착 영역 타일 채우기 */
function drawGreenRoom(startX, startY, width, height){
    c.fillStyle = 'rgb(192, 229, 201)';
    //직사각형 범위 전체 적용
    c.fillRect(startX,startY,width,height);
}
/* 3. 체크 타일 채우기 */
function drawCheckBoxRoomWhite(startX, startY){
    count++;
    c.fillStyle = 'rgb(255, 255, 255)';
    c.fillRect(startX,startY-1,blockSize,blockSize); //균형이 안맞아서 -1처리해줌
}
function drawCheckBoxRoomPurple(startX, startY){
    count++;
    c.fillStyle = 'rgba(175, 183, 255, 0.733)';
    c.fillRect(startX,startY-1,blockSize,blockSize);
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
        console.log("update func");
        if(this.direction == "right"){
            if(this.x < this.startX || this.x > this.finishX)  //시작점과 끝점 사이를 이동
                this.speed = -this.speed;
            this.x += this.speed;
        } else {
            if(this.x > this.startX || this.x < this.finishX) //시작점과 끝점 사이를 이동
                this.speed = -this.speed;
            this.x += this.speed;
        }
        console.log("draw func");
        c.beginPath();
        c.arc(this.x,this.y,radius,0,Math.PI*2,false);
        c.fillStyle = 'yellow';
        c.fill();
        c.strokeStyle = 'black';
        c.stroke();
    }
}

/* 출발-도착 영역 타일 채우기 */
drawGreenRoom(50,140,blockSize*3,blockSize*6);
drawGreenRoom(455,140,blockSize*3,blockSize*6);
/* 체크 영역 타일 채우기 */
// let count = 0;
// drawCheckBoxRoomWhite(50+blockSize*3,140+blockSize*5);
// drawCheckBoxRoomPurple(50+blockSize*4,140+blockSize*5);
// for(let i=0; i<4; i++) {
//     for(let j=0; j<10; j++) {
//         if(count%2==0) drawCheckBoxRoomPurple(50+blockSize*(4+j),140+blockSize*(i+1));
//         else drawCheckBoxRoomWhite(50+blockSize*(5+j),140+blockSize*(i+1));
//     }
// }

/* 맵 line 그리기 */
drawFirstLine(50,140,50,300);
drawNextLine(lastX+(blockSize*5),lastY); //오른쪽으로 이동
drawNextLine(lastX,lastY-(blockSize*1)); //위쪽으로 이동
drawNextLine(lastX+(blockSize*9),lastY); //오른쪽
drawNextLine(lastX,lastY-(blockSize*4)); //위쪽
drawNextLine(lastX+(blockSize*1),lastY); //오른쪽
drawNextLine(lastX,lastY+(blockSize*5)); //아래쪽
drawNextLine(lastX+(blockSize*3),lastY); //오른쪽
drawNextLine(lastX,lastY-(blockSize*6)); //위쪽
drawNextLine(lastX-(blockSize*5),lastY); //왼쪽
drawNextLine(lastX,lastY+(blockSize*1)); //아래쪽
drawNextLine(lastX-(blockSize*9),lastY); //왼쪽
drawNextLine(lastX,lastY+(blockSize*4)); //아래쪽
drawNextLine(lastX-(blockSize*1),lastY); //왼쪽
drawNextLine(lastX,lastY-(blockSize*5)); //위쪽
drawNextLine(lastX-(blockSize*3),lastY); //왼쪽
c.lineWidth = 1;



/* 다중 장애물 생성 */
let circle = [new Circle(170+radius, 180, 3, 418-radius, 180,"right")];
circle.push(new Circle(418-radius, 180+blockSize*1, 3, 170+radius,180+blockSize*1,"left"));
circle.push(new Circle(170+radius, 180+blockSize*2, 3, 418-radius,180+blockSize*2,"right"));
circle.push(new Circle(418-radius, 180+blockSize*3, 3, 170+radius,180+blockSize*3,"left"));

/* 애니메이션 */
function animate(){
    console.log("animate func");
    //장애물 이동범위 초기화
    for(let i=0;i<circle.length;i++){
        c.clearRect(circle[i].x-radius-3,circle[i].y-radius-5,blockSize-2,blockSize-3);
    }
    //장애물 draw
    for(let i=0;i<circle.length;i++){
        circle[i].draw();
    }
    requestAnimationFrame(animate);
}
animate();