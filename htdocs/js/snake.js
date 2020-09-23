const cvs = document.getElementById("snake");
const ctx = cvs.getContext("2d");

const row = 32;
const column = 32;
const SQ =  squareSize = 32;
const VACANT = "white"; //empty squares

function drawSquare(x, y, color){
    ctx.fillStyle = color;
    ctx.fillRect(x*SQ, y*SQ, SQ, SQ );
    ctx.strokeStyle = "black";
    ctx.strokeRect(x*SQ, y*SQ, SQ, SQ );

}

//create the board
let board = [];
for(r = 0; r < row; r++){
    board[r] = [];
    for(c=0; c < column; c++){
        board[r][c] = VACANT;
    }
}

//draw the board to the canvas
function drawBoard(){
    for(r = 0; r < row; r++){
        for(c = 0; c < column; c++){
            drawSquare(c, r, board[r][c]);
        }
    }
}
drawBoard();

//create snake
let snake = [];
snake[0] = {x: 9 * SQ, y: 10 *SQ };

//create food
let food = {
    x: Math.floor(Math.random()*17 + 1)
}


//snake controls

let d;

document.addEventListener("keydown", direction);
function direction(event){
    let key = event.keyCode;
    if(key == 37 && d!="right"){
        left.play();
        d= "left";
    }
    else if(key == 38 && d!="down"){
        d="up";
        up.play();
    }
    else if(key == 39 && d!= "left"){
        d = "right";
        right.play();
    }
    else if(key == 40 && d!= "up"){
        d="down";
        down.play();
    }
}

//check collision