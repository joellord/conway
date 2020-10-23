// alive 2 || 3 live
// dead == 3 become alive
// otherwise die

if (!process.argv[2]) {
  console.log("You must specify how many generations you want the game to last.");
}

if (!process.argv[3]) {
  console.log("You must specify the pause length in seconds between each redraw.");
  console.log("node ./game-of-life.js <generations> <delay>");
  process.exit();
}
  
const GENERATIONS = process.argv[2] || 3;
const DELAY = process.argv[3] || 1;

let originalBoard = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 1, 1, 1, 0, 0, 1, 0, 1, 1, 1, 0, 0],
  [0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
];

let numberOfRows = originalBoard.length;
let numberOfColumns = originalBoard[0].length;

let emptyBoard = [];
for (let i = 0; i < numberOfRows; i++) {
  emptyBoard.push([]);
  for (let j = 0; j < numberOfColumns; j++) {
    emptyBoard[i].push(0);
  }
}


const deepCopy = (inObject) => {
  let outObject, value, key

  if (typeof inObject !== "object" || inObject === null) {
    return inObject // Return the value if inObject is not an object
  }

  // Create an array or object to hold the values
  outObject = Array.isArray(inObject) ? [] : {}

  for (key in inObject) {
    value = inObject[key]

    // Recursively (deep) copy for nested objects, including arrays
    outObject[key] = deepCopy(value)
  }

  return outObject
}

const processRules = (cellValue, neighboursCount) => {
  if (cellValue && neighboursCount === 2) return 1;
  if (cellValue && neighboursCount === 3) return 1;
  if (!cellValue && neighboursCount === 3) return 1;
  return 0;
}
  
const processBoard = (board) => {
  // Create empty board
  let newBoard = deepCopy(emptyBoard);

  for (let row = 0; row < board.length; row++) {
    // console.log(board[row].join(","));
    for (let column = 0; column < board[row].length; column++) {
      
      // Find Living Neighbours
      // N, NE, E, SE, S, SW, W, NW
      // [0, -1] N
      // if row or column we should check
      // if row or column is max then check
      
      let N = row === 0 ? null : [row - 1, column];
      let E = column === numberOfColumns - 1 ? null : [row, column + 1];
      let S = row === numberOfRows - 1 ? null : [row + 1, column];
      let W = column === 0 ? null : [row, column - 1];
      let NE = (row === 0 || column === numberOfColumns - 1 ) ? null : [row - 1, column + 1];
      let SE = (row === numberOfRows - 1 || column === numberOfColumns - 1) ? null : [row + 1, column + 1];
      let NW = (row === 0 || column === 0) ? null : [row - 1, column - 1];
      let SW = (row === numberOfRows - 1 || column === 0) ? null : [row + 1, column - 1];
      
      let neighbours = [N, E, S, W, NE, SE, NW, SW].filter(item => {
        if (!item) return false;
        if (board[item[0]][item[1]]) return true;
        return false;
      }).length;
      
      // Apply rules
      let cell = board[row][column];
      newBoard[row][column] = processRules(cell, neighbours);

      // Redraw our board

    }
  }
  return newBoard;
  // return new board
};
  // Iterate again and again

let generation = 0;

const pause = (seconds) => {
  return new Promise((resolve) => {
    setTimeout(resolve, seconds * 1000);
  });
}

const drawBoard = (board, gen) => {
  console.log(`Generation ${gen}`);
  console.log(board.map(items => items.join(" ").replace(/0/ig, " ").replace(/1/ig, "#")).join("\n"));
  process.stdout.write(`\x1b[${numberOfRows + 1}A`);
}

const main = async () => {
  do {
    originalBoard = processBoard(originalBoard);
    drawBoard(originalBoard, generation);
    await pause(DELAY);
    drawBoard(emptyBoard, generation);
    let boardValue = originalBoard.flat().reduce((a,b)=> a+b);
    if (boardValue === 0) {
      console.log("All cells are dead...");
      break;
    }
    generation++;
  } while (generation < GENERATIONS);
}

main();