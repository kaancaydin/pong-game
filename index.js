let canvas;
let canvasContext; 
let ballX = 50;
let ballY = 50;
let ballSpeedX = 10;
let ballSpeedY = 5;

let playerScore = 0;
let computerScore = 0;
const WINNING_SCORE = 3;

let victoryCelebration = false;

let paddle1Y = 250;
let paddle2Y = 250;
const PADDLE_HEIGHT = 100;
const PADDLE_THICKNESS = 10;

function calculateMousePos(e){
    let rect = canvas.getBoundingClientRect();
    let root = document.documentElement;
    let mouseX = e.clientX - rect.left - root.scrollLeft;
    let mouseY = e.clientY - rect.top - root.scrollTop;; 
    return{
        x:mouseX,
        y:mouseY
    };
}

function handleMouseClick(e){
    if(victoryCelebration){
        playerScore = 0;
        computerScore = 0;
        victoryCelebration = false;
    }
}
window.onload = function(){
    canvas = document.getElementById("gameCanvas");
    canvasContext = canvas.getContext('2d');
    /*
    canvasContext.fillStyle = 'black';
    canvasContext.fillRect(0,0,canvas.width, canvas.height); //x,y,width,height
    Rect -> Reactangle
    x -> sağ sol
    y -> aşağı yukarı
    */
    let fps = 30;
    setInterval(()=>{
    moveIt();
    drawCanvas();
    }, 1000 / fps);

    canvas.addEventListener("mousedown",handleMouseClick);

    canvas.addEventListener('mousemove',
    function(e){
        let mousePos = calculateMousePos(e);
        paddle1Y = mousePos.y-(PADDLE_HEIGHT/2);
    })
}

function computerMovement(){
    let paddle2YCenter = paddle2Y + (PADDLE_HEIGHT/2);
    if(paddle2YCenter< ballY - 35){
        paddle2Y += 6;
    }else if(paddle2YCenter > ballY + 35){
        paddle2Y -= 6;
    }
}

function moveIt(){
    if(victoryCelebration){
        return;
    }

    computerMovement();

    ballX= ballX + ballSpeedX;
    ballY= ballY + ballSpeedY;
    
    if(ballX > canvas.width){
        //ballSpeedX = -ballSpeedX;
        if(ballY > paddle2Y  &&
            ballY < paddle2Y+PADDLE_HEIGHT)
        {
            ballSpeedX = -ballSpeedX;
            let deltaY = ballY - (paddle2Y+(PADDLE_HEIGHT/2));
            ballSpeedY = deltaY * 0.35;
        }else{
            playerScore++;
            resetBall();
        }
    }
    if(ballX < 0){
        //ballSpeedX = -ballSpeedX;
        if(ballY > paddle1Y  &&
            ballY < paddle1Y+PADDLE_HEIGHT)
        {
            ballSpeedX = -ballSpeedX;
            let deltaY = ballY - (paddle1Y+(PADDLE_HEIGHT/2));
            ballSpeedY = deltaY * 0.35;
        }else{
            computerScore++;
            resetBall();
        }
    }
    if(ballY > canvas.height){
        ballSpeedY = -ballSpeedY;
    }
    if(ballY < 0){
        ballSpeedY = -ballSpeedY;
    }

}

function resetBall(){
    if(computerScore >= WINNING_SCORE || playerScore >= WINNING_SCORE){
        victoryCelebration = true;
    }
    ballX = canvas.width/2;
    ballY = canvas.height/2;
    ballSpeedX = -ballSpeedX;
}

function drawNet(){
    for (let index = 0; index < canvas.height; index+=40) {
        colorRect(canvas.width/2 - 1,index,2 , 20, 'white');
    }
}

function drawCenteredText(text, y) {
    let textWidth = canvasContext.measureText(text).width;
    canvasContext.fillText(text, (canvas.width - textWidth) / 2, y);
}

function drawCanvas(){
    //background
    colorRect(0,0,canvas.width , canvas.height, 'black');
    
    if(victoryCelebration){
        canvasContext.fillStyle = 'white';
        canvasContext.font = "40px 'VT323'";

        if(playerScore >= WINNING_SCORE){
            drawCenteredText("WE HAVE A WINNER", 200);
        } else if(computerScore >= WINNING_SCORE){
            drawCenteredText("YOU LOST", 200);
        }
        drawCenteredText("CLICK TO CONTINUE", 500);
        return;
    }

    drawNet();
    //left paddle
    colorRect(0,paddle1Y,PADDLE_THICKNESS,PADDLE_HEIGHT,'white'); 
    //right paddle
    colorRect(canvas.width - PADDLE_THICKNESS,paddle2Y,PADDLE_THICKNESS,PADDLE_HEIGHT,'white');
    //ball 
    colorCircle(ballX,ballY,10,'white');
    /*
    canvasContext.fillStyle = 'blue';
    canvasContext.fillRect(20,20,ballX, ballY);
    */
    canvasContext.font = "50px 'VT323'";
    canvasContext.fillText(playerScore, 100, 100);
    canvasContext.fillText(computerScore, canvas.width-100, 100);
}

function colorRect(leftX, topY, width, height, drawColor){
    canvasContext.fillStyle = drawColor;
    canvasContext.fillRect(leftX, topY, width, height); 
}

function colorCircle(centerX, centerY, radius, drawColor ){
    canvasContext.fillStyle = drawColor;
    canvasContext.beginPath();
    canvasContext.arc(centerX,centerY,radius,0,Math.PI*2,true);
    //x,y,center of circle, its radius,angles,radians
    canvasContext.fill();
}