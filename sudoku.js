
//global consctor. Fix: is this really used?
Cell = function(x,y){
  this.x = x;
  this.y = y;
  this.value = undefined;
  this.potential= [1,2,3,4,5,6,7,8,9];

}

Cell.prototype.clone = ()=>{

  var newCell = new Cell(this.x, this.y);
  newCell.value =  this.value;

  return newCell;

}

Cell.prototype.isSolved = ()=> {
  
  return this.value !== undefined;
};

//solve one cell
//check which of the values from one to nine that is not existing in any other list
function getPotentialValues(cell, cellList){

  var rowValues = getRowValues(cell, cellList);

  var colValues = getColumnValues(cell, cellList);

  var boxValues = getSquareValues(cell, cellList);

  var potential = cell.potential;

  //remove element that are not potential values
  var newPotential = potential.filter(function(number){
    var numberIsOccupied =  numberExistsInArray(rowValues, number) || 
        numberExistsInArray(colValues, number) || 
        numberExistsInArray(boxValues, number)
    return !numberIsOccupied;
  });

  return newPotential;

};

function numberExistsInArray(numberList, number){

      //if the number we're checking exist in cell's potential we say true
      var numberInCellPotential = numberList.some(function(potentialValue){

        return potentialValue === number;
      });


      return numberInCellPotential;

}


//check every number from 1 to 9 and check if there is any number s.t. it can only be at one place in box
function findBoxSolution(cellsInBox){

  //for every number we check if we can find how many cells there exist for that value
  var numbers = [1,2,3,4,5,6,7,8,9];	

  var cellsWithSolution = numbers.reduce(function(cellList, number){

    //only interested in cells that do not have a solution
    var emptyCells = cellsInBox.filter(cell=> cell.value === undefined);

    
    var cellsThatCanContainNumber = emptyCells.filter(function(cell){

      return numberExistsInArray(cell.potential, number);

    });

    //if there is only one place the number can fit it's a match
    if(cellsThatCanContainNumber.length === 1){
      var cell = cellsThatCanContainNumber[0];

      return cellList.concat({cell:cell, value:number});
    }
    else {
      return cellList;
    }

  },[]);

  return cellsWithSolution;

}

//find solution for sudokubox
//fix: remove this function and move logic to calling function
function solveBox(cellsInBox, cellList){

  //for every number we check if we can find how many cells there exist for that value
  var cellsWithSolution = findBoxSolution(cellsInBox);
  //matchingNumbers look like following {cell: cell, value:number}. It will only be one value and that's the only value the cell can take
  cellsWithSolution.forEach(function(cellObject){
    var cell =	cellObject.cell;
    var value = cellObject.value;

    //find the cell in cewllList and change the potential 
    var globalCell = getCell(cell.x, cell.y, cellList);
    globalCell.potential = [value];
  });

}

//solve one more step
function solveStep(cellList){

  //this command will find every value that has to be because no other values fit	
  cellList.forEach(function(cell){
    var potentialList = getPotentialValues(cell, cellList);
    cell.potential = potentialList;
  });

  
  var boxList = cellList.map(function(cell){

    return getSquare(cell, cellList);

  });


  //go through all the cells and solve for every box
  boxList.forEach(function(box){

    solveBox(box,cellList);

  });

  //check what cells that we can solve
  var filteredList = cellList.filter(function(cell){

    return cell.potential.length === 1 && cell.value === undefined;
  });

  //set every solvable cell to the solution
  filteredList.forEach(function(cell){

    cell.value = cell.potential.pop();

  });

  //return the cellList
  return cellList;

};



//this is the function that get's exported
function solveGameFromClient(sudokuFromClient){

  var cellList = [];

  //creating the cellList
  for(var i = 1; i < 10; i++){

    for(var j = 1; j < 10 ; j++){
      cell = new Cell(i,j);
      cellList.push(cell);
    }

  }

  //a cell looks like following {row, column, value, potential}
  sudokuFromClient.forEach(function(cell){

    setCell(cell.row + 1, cell.column +1, cell.value, cellList);

  });


  var solvedGame = solveStep(cellList);

  var correctedGame = solvedGame.map(function( cell ){return {row:cell.x - 1, column : cell.y - 1, value: cell.value}});

  return correctedGame;

}

//set cell to the value and make the potentials only the current value
function setCell(x,y, value, cellList){
  var cell = getCell(x,y, cellList);
  cell.value = value;
  if(value == undefined){

    cell.potential = [1,2,3,4,5,6,7,8,9];
  }
  else {

    cell.potential = [value];
  }


}

//fix: change to find?
function getCell(x, y, cellList){
  var filteredArray = cellList.filter(function(cell){
    return cell.x === x && cell.y === y;
  });
  return filteredArray[0];
}

// returns array with row
function getRow(cell, cellList){
  var rowArray = cellList.filter(function(cellInCellList){
    return cell.x === cellInCellList.x;
  });	
  return rowArray;
}

function getRowValues(cell, cellList){
  var rowArray = cellList.filter(function(cellInCellList){
    return cell.x === cellInCellList.x;
  });	
  return rowArray.map(cell=>cell.value);
}
// returns array with column
function getColumn(cell, cellList){

  var columnArray = cellList.filter(function(cellInCellList){
    return cell.y === cellInCellList.y;
  });	
  return columnArray;
}

function getColumnValues(cell, cellList){

  var columnArray = cellList.filter(function(cellInCellList){
    return cell.y === cellInCellList.y;
  });	
  return columnArray.map(cell=>cell.value);
}


function getSquareValues(cell, cellList){

  var squareArray = cellList.filter(function(cellInCellList){

    //fix: why /3?
    return Math.ceil(cellInCellList.x/3) === Math.ceil(cell.x/3) && Math.ceil(cellInCellList.y/3) === Math.ceil(cell.y/3);
  });	

  return squareArray.map(cell=>cell.value);
}
//returns array with the column
function getSquare(cell, cellList){

  var squareArray = cellList.filter(function(cellInCellList){

    //fix: why /3?
    return Math.ceil(cellInCellList.x/3) === Math.ceil(cell.x/3) && Math.ceil(cellInCellList.y/3) === Math.ceil(cell.y/3);
  });	

  return squareArray;
}

//fix: rename
module.exports = {

  solveGame: solveGameFromClient,
  __test__: {
    solveBox: solveBox,
    Cell: Cell,
    getPotentialValues: getPotentialValues,
    findBoxSolution: findBoxSolution  
  }
}


