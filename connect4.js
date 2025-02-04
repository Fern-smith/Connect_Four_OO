/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

class Player {
  constructor(color, playerNumber){
    this.color = color; 
    this.playerNumber = playerNumber;
  }
}

class Game {
  constructor(
    player1Color = "#D8EEDF",
    player2Color = "#FEDCD8"
  ){
    this.HEIGHT = 6;
    this.WIDTH = 7;
    this.gameOver = false;
    this.htmlBoard = document.getElementById('board');

    this.player1 = new Player(player1Color,1); //Create player1 
    this.player2 = new Player(player2Color,2); //Create player2
    this.currPlayer = this.player1; // Start with player1 

    this.board = []; // array of rows, each row is array of cells  (board[y][x])
    this.makeBoard();
    this.makeHtmlBoard();
  }

/** makeBoard: create in-JS board structure:
 *   board = array of rows, each row is array of cells  (board[y][x])
 */

makeBoard() {
  this.board = Array.from({length: this.HEIGHT}, () => 
  Array(this.WIDTH).fill(null)
  );
}

/** makeHtmlBoard: make HTML table and row of column tops. */

makeHtmlBoard() {
  this.htmlBoard.innerHTML = ""; // Clear old board if restarting

  // make column tops (clickable area for adding a piece to that column)
  const top = document.createElement('tr');
  top.setAttribute('id', 'column-top');
  top.addEventListener('click',(evt) => this.handleClick(evt));

  for (let x = 0; x < this.WIDTH; x++) {
    const headCell = document.createElement('td');
    headCell.setAttribute('id', x);
    top.append(headCell);
  }

  this.htmlBoard.append(top);

  // Create board row
  for (let y = 0; y < this.HEIGHT; y++) {
    const row = document.createElement('tr');
    for (let x = 0; x < this.WIDTH; x++) {
      const cell = document.createElement('td');
      cell.setAttribute('id', `${y}-${x}`);
      row.append(cell);
    }
    this.htmlBoard.append(row);
  }
}

/** findSpotForCol: given column x, return top empty y (null if filled) */

findSpotForCol(x) {
  for (let y = this.HEIGHT - 1; y >= 0; y--) {
    if (!this.board[y][x]) return y; 
    }
    return null;
  }

/** placeInTable: update DOM to place piece into HTML table of board */

placeInTable(y, x) {
  const piece = document.createElement('div');
  //Ensure p1, p2 is assigned here.
  piece.classList.add('piece');
  piece.style.backgroundColor = this.currPlayer.color;
  piece.style.top = `${-50 * (y + 2)}px`;

  document.getElementById(`${y}-${x}`).append(piece);
}

/** endGame: announce game end */

endGame(msg) {
  this.gameOver = true;
  setTimeout(() => alert(msg), 10);
}

/** handleClick: handle click of column top to play piece */

handleClick(evt) {
  if(this.gameOver)return;
  // get x from ID of clicked cell
  const x = +evt.target.id;
  // get next spot in column (if none, ignore click)
  const y = this.findSpotForCol(x);
  if (y === null) return;

  // place piece in board and add to HTML table
  this.board[y][x] = this.currPlayer;
  this.placeInTable(y,x);
  
  // check for win
  if (this.checkForWin()) {
    const winner = this.currPlayer === this.player1 ? "Player 1" : "Player 2";
    return this.endGame(`${winner}. You are won!`);
  }
  // check for tie
  if (this.board.every(row => row.every(cell => cell !== null))) {
    return this.endGame("It is a Tie!");
  }

  // switch players
  this.currPlayer = this.currPlayer === this.player1 ? this.player2 : this.player1;
  }
    
/** checkForWin: check board cell-by-cell for "does a win start here?" */

checkForWin() {

    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer
    const _win = (cells) => 
    cells.every(
      ([y,x]) => 
    y >= 0 &&
    y < this.HEIGHT && 
    x >= 0 && 
    x < this.WIDTH && 
    this.board[y][x] === this.currPlayer
  );

  for (let y = 0; y < this.HEIGHT; y++) {
    for (let x = 0; x < this.WIDTH; x++) {
      // get "check list" of 4 cells (starting here) for each of the different
      // ways to win
      const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
      const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
      const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
      const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

      // find winner (only checking each win-possibility as needed)
      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) return true;
      }
    }
    return false;
  }
}
  
  let gameInstance; 
  document.getElementById('start-game').addEventListener('click', (event) => {
    event.preventDefault();
    const player1Color = document.getElementById("player1-color").value;
    const player2Color = document.getElementById("player2-color").value;
    gameInstance = new Game(player1Color ,player2Color);
});


