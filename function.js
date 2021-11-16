/* 글작성 - 라인그리기 연습 */
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

ctx.font = 'italic 20px';
ctx.fillText('Hello World!',10,10);

for(var i=1;i<=10;i++){
    ctx.beginPath();
    ctx.rect(20, 40+i*50, 50, 50);
    ctx.fillStyle = "red";
    ctx.fill();
    ctx.closePath();
}
/* draw lines */
ctx.beginPath();
ctx.moveTo(50,10);
ctx.lineTo(50,50);
ctx.stroke();