const cvs = document.getElementById('tetris');
const ctx = cvs.getContext('2d');
const scoreCounter = document.getElementById("score");

const row = 20;
const column = 10;
const SQ =  squareSize = 40;
const VACANT = "white"; //empty squares

//draws a square
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


//pieces and colours

const Pieces = [
    [Z, "red"],
    [S, "green"],
    [T, "yellow"],
    [O, "blue"],
    [L, "purple"],
    [I, "cyan"],
    [J, "orange"]
];

//random pieces
function randomPiece(){
    let r = randomNumber = Math.floor(Math.random() * Pieces.length)
    return new Piece(Pieces[r][0], Pieces[r][1]);

}

let p = randomPiece();

function Piece(tetromino, color){
    this.tetromino = tetromino;
    this.color = color;
    
    this.tetrominoN = 0; //starting from the original pattern
    this.activeTetromino = this.tetromino[this.tetrominoN];

    this.x = 3;
    this.y = -2;
}

//fill the piece
Piece.prototype.fill = function(color){
    for(r = 0; r < this.activeTetromino.length; r++){
        for(c = 0; c < this.activeTetromino.length; c++){
            if(this.activeTetromino[r][c]){

                drawSquare(this.x + c,this.y + r, color);
            }
        }
    }
 }

//draw the Piece
Piece.prototype.draw = function(){
    this.fill(this.color);
}

//undraw the piece
Piece.prototype.unDraw = function(){
    this.fill(VACANT);
}

//move the pieces down
Piece.prototype.moveDown = function(){
    if(!this.collision(0,1,this.activeTetromino)){
        this.unDraw();
        this.y++;
        this.draw();
    }else{
        //lock in the pieces and send the next  pieces
        this.lock();
        p = randomPiece();
    }
}

//move the pieces right
Piece.prototype.moveRight = function(){
    if(!this.collision(1,0,this.activeTetromino)){
        this.unDraw();
        this.x++;
        this.draw();
    }
}

//move the pieces left
Piece.prototype.moveLeft = function(){
    if(!this.collision(-1,0,this.activeTetromino)){
        this.unDraw();
        this.x--;
        this.draw();
    }
    
}

//move the pieces down
Piece.prototype.rotate = function(){
    let nextPattern = this.tetromino[(this.tetrominoN + 1)%this.tetromino.length];
    let kick = 0;
    
    if(this.collision(0,0,nextPattern)){
        if(this.x > column/2){
            // it's the right wall
            kick = -1; // we need to move the piece to the left
        }else{
            // it's the left wall
            kick = 1; // we need to move the piece to the right
        }
    }
    
    if(!this.collision(kick,0,nextPattern)){
        this.unDraw();
        this.x += kick;
        this.tetrominoN = (this.tetrominoN + 1)%this.tetromino.length; // (0+1)%4 => 1
        this.activeTetromino = this.tetromino[this.tetrominoN];
        this.draw();
    }
    
}

let score = 0;
Piece.prototype.lock = function(){
    for(r = 0; r < this.activeTetromino.length; r++){
        for(c = 0; c < this.activeTetromino.length; c++){
            //skip the vacant squares
            if(!this.activeTetromino[r][c]){

                continue;
            }
            //check if pieces have reached the top
            if(this.y + r < 0){
                alert ("Game Over! You scored: " + score + "!");
                gameOver = true;
                break;
            }
            board[this.y+r][this.x+c] = this.color;
        }
    }
    //remove the full rows
    for(r = 0; r < row; r++){
        let isRowFull = true;
        for(c=0; c<column; c++){
            isRowFull = isRowFull && (board[r][c] !=VACANT);
        }
        if(isRowFull){
            //move all rows above it down
            for(y = r; y>1; y--){
                for(c = 0; c < column; c++){

                    board[y][c] = board[y-1][c];
                }
            }
            //the top row has no row above it
            for(c = 0; c < column; c++){
                board[0][c] = VACANT;
            }
            //increase the score
            score += 10;
        }
    }
    //update the board
    drawBoard();

    scoreCounter.innerHTML = score;

}

//Collision
Piece.prototype.collision = function(x, y, piece){
    for(r = 0; r < piece.length; r++){
        for(c = 0; c < piece.length; c++){
            //if the square is empty, it is skipped
            if(!piece[r][c]){
                continue;
            }
            //coordinates of the piece after movement
            let newX = this.x + c + x;
            let newY = this.y + r + y;

            //conditions
            if(newX < 0 || newX >= column || newY >= row){
                return true;
            }
            //skip 
            if(newY < 0){
                continue;
            }
            //check for locked pieces
            if(board[newY][newX] != VACANT){
                return true;
            }
        }
    }
    return false;
}

//controlling the pieces
document.addEventListener("keydown", CONTROL);

function CONTROL(event){
    if(event.keyCode == 37){
        p.moveLeft();
        dropStart = Date.now();
    }else if(event.keyCode == 38){
        p.rotate();
        dropStart = Date.now();
    }else if(event.keyCode == 39){
        p.moveRight();
        dropStart = Date.now();
    }else if(event.keyCode == 40){
        p.moveDown();
    }
}

//drop every second
let dropStart = Date.now();
let gameOver = false;
function drop(){
    let now = Date.now();
    let delta = now - dropStart;
    if(delta > 1000){
        p.moveDown();
        dropStart = Date.now()
    }
    if( !gameOver){
        requestAnimationFrame(drop);
    }
}

drop();
