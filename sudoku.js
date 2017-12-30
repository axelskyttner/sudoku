
//global consctor. Fix: is this really used?
Cell = function(x,y){
  this.x = x;
  this.y = y;
  this.value = undefined;
  this.potential= [1,2,3,4,5,6,7,8,9];

}

Cell.prototype.isSolved = ()=> {
  
  return this.value !== undefined;
};


//solve one cell
function getPotentialValues(cell, cellList){
  var potentialList = cell.potential;

  var sortedArrayRow = sortArray(getRow(cell, cellList));

  var sortedArrayColumn = sortArray(getColumn(cell, cellList));

  var sortedArrayBox = sortArray(getSquare(cell, cellList));


  var rowValues = sortedArrayRow.map(cell=>cell.value);
  var colValues = sortedArrayColumn.map(cell=>cell.value);
  var boxValues = sortedArrayBox.map(cell=>cell.value);

  var newPotential = potentialList.filter(function(number){
    if(
        numberExistsInArray(rowValues, number) || 
        numberExistsInArray(colValues, number) || 
        numberExistsInArray(boxValues, number))
    {
      return false;
    }
    else {
      return true;
    }
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



//this solves the game
//returns a cellList
function solveGame(cellList){

  //solve one more time
  cellList = solveStep(cellList);

  //check if it's solvable by solving one more time and check if it's less undefined values
  var nextCellList = solveStep(solveStep(cellList));

  //counting the number of empty cells
  var numberOfEmptyCells = cellList.reduce(function(acc,cell){
    if(cell.value === undefined){

      return acc + 1;
    }

    else{

      return acc;
    }
  }, 0);


  //counting the number of empty cells
  var numberOfEmptyCellsNext = nextCellList.reduce(function(acc,cell){
    if(cell.value === undefined){

      return acc + 1;
    }

    else{

      return acc;
    }
  }, 0);

  //check if there is any cells left unsolved
  var unsolvedFlag = numberOfEmptyCells > 0;

  //check if it's solvable
  var solvable = numberOfEmptyCellsNext < numberOfEmptyCells;

  if( !solvable ) {

    return cellList;

  }
  else if(unsolvedFlag ){

    return solveGame(cellList);
  }

  //fix: what is this case?
  else{
    return cellList;
  }


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

  //a cell looks like following {row, column, value}
  sudokuFromClient.forEach(function(cell){

    setCell(cell.row + 1, cell.column +1, cell.value, cellList);

  });


  var solvedGame = solveGame(cellList);

  var correctedGame = solvedGame.map(function( cell ){return {row:cell.x - 1, column : cell.y - 1, value: cell.value}});
  return correctedGame;
}

//set cell to the value and make the potentials only the current value
function setCell(x,y, value, cellList){
  var cell = getCell(x,y, cellList);
  cell.value = value;
  cell.potential = [value];


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

// returns array with column
function getColumn(cell, cellList){

  var columnArray = cellList.filter(function(cellInCellList){
    return cell.y === cellInCellList.y;
  });	
  return columnArray;
}

//returns array with the column
function getSquare(cell, cellList){

  var squareArray = cellList.filter(function(cellInCellList){

    //fix: why /3?
    return Math.ceil(cellInCellList.x/3) === Math.ceil(cell.x/3) && Math.ceil(cellInCellList.y/3) === Math.ceil(cell.y/3);
  });	

  return squareArray;
}

function sortArray(array){
  //var sortedArray = [];
  var sortedArray2 = array.slice();

  var sortedArray3 = array.map(function(cell, index ){
    var valueToBeInsertedIndex = sortedArray2.findIndex(function(cell){
      return cell.value -1  === index;
    });

    if(valueToBeInsertedIndex > -1){

      var returnValue = sortedArray2.splice(valueToBeInsertedIndex,1);
      return returnValue[0];
    }
    else {
      var undefinedValueIndex = sortedArray2.findIndex(function(cell){
        return cell.value === undefined;
      });
      var returnValue = sortedArray2.splice(undefinedValueIndex,1);
      return returnValue[0];
    }


  });

  sortedArray2.sort(function(cell1, cell2){
    if(cell1.value === undefined){
      return true;
    }
    else if(cell2.value === undefined){
      return false;
    }
    else {

      return cell1.value > cell2.value;
    }
  });


  return sortedArray3;

}


//fix: rename
module.exports = {

  solveGame: solveGameFromClient,
  __test__: {
    solveBox: solveBox,
    Cell: Cell,
    getPotentialValues: getPotentialValues,
    findBoxSolution: findBoxSolution  
  },
  solveGame2: solveGame
}


