changeUserInfo(1,0);
changeMap(1);

/* 맵 생성 */
let stage1 = new Mapp(1,72.5,200,437+blockSize,119.5,437+blockSize,146.5);
/* 다중 장애물 생성 */
stage1.obstacle.push(new Circle(170+radius, 180, 3, 418-radius, 180,"right"));
stage1.obstacle.push(new Circle(418-radius, 180+blockSize*1, 3, 170+radius,180+blockSize*1,"left"));
stage1.obstacle.push(new Circle(170+radius, 180+blockSize*2, 3, 418-radius,180+blockSize*2,"right"));
stage1.obstacle.push(new Circle(418-radius, 180+blockSize*3, 3, 170+radius,180+blockSize*3,"left"));
/* 플레이어 생성 */
let square = new Square(stage1.startX,stage1.startY);


let value=0;
/* 애니메이션 */
function animate(){
    //console.log("animate func");
    //장애물 이동범위 초기화
    for(let i=0;i<stage1.obstacle.length;i++){
        c.clearRect(stage1.obstacle[i].x-radius-3,stage1.obstacle[i].y-radius-5,blockSize-2,blockSize-3);
    }
    //장애물 draw
    for(let i=0;i<stage1.obstacle.length;i++){
        stage1.obstacle[i].draw();
    }
    //플레이어 이동 후 그리기
    c.clearRect(square.x-0.5,square.y-0.5,square.width+1,square.height+1);
    square.move();
    square.draw();
    requestAnimationFrame(animate);
    
    if(value==1) deleteMap();
}
animate();