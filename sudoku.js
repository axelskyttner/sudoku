
//global consctor. Fix: is this really used?
Cell = function(x,y){
  this.x = x;
  this.y = y;
  this.value = undefined;
  this.potential= [];

}

//numberlist to use for dev
var numberList = [1,2,3,4,5,6,7,8,9];

//solve one cell
function solveCell(cell, cellList){
  cell.potential = [];

  var sortedArrayRow = sortArray(getRow(cell, cellList));

  var sortedArrayColumn = sortArray(getColumn(cell, cellList));

  var sortedArrayBox = sortArray(getSquare(cell, cellList));

  var rowColumnBoxList = [sortedArrayRow, sortedArrayColumn, sortedArrayBox]
    var valueList = rowColumnBoxList.map(function(cellArray){

      return cellArray.map(function(cell){return cell.value});
    });

  var busyArray = getBusyNumbers(valueList);

  busyArray.forEach(function(valueInBusyList, index){

    if(valueInBusyList === undefined){
      cell.potential.push(index +1);
    };

  });

};

//find solution for sudokubox
function solveBox(boxList, cellList){

  //for every number we check if we can find how many cells there exist for that value
  var numbers = [1,2,3,4,5,6,7,8,9];	

  var matchingNumbers = numbers.map(function(number){

    //get all the cells that the number can be in
    var matchingArrays = boxList.filter(function(cell){
      //first it has to be unassigned value and the 
      return	cell.value === undefined && cell.potential.some(function(potentialValue){

        return potentialValue === number;
      });


    });
    //if there is only one place the number can fit it's a match
    if(matchingArrays.length === 1){
      var cell = matchingArrays[0];
      return {cell:cell, value:number}; 
    }
    else {
      return false;
    }
  }).filter(function(maybeCell){return maybeCell !== false});

  //matchingNumbers look like following {cell: cell, value:number}. It will only be one value and that's the only value the cell can take
  matchingNumbers.forEach(function(cellObject){
    var cell =	cellObject.cell;
    var value = cellObject.value;

    //global cell
    var globalCell = getCell(cell.x, cell.y, cellList);
    globalCell.potential = [value];
  });

}

//solve one more step
function solveStep(cellList){

  //this command will find every value that has to be because no other values fit	
  cellList.forEach(function(cell){
    solveCell(cell, cellList);
  });

  //we can also use the fact that given that we have to put in a number, where in the row can that number be. 			

  //this is the first cell in every box
  var boxList = cellList.filter(function(cell){
    return ( cell.x === 1 && cell.y === 1 ) ||
      (cell.x === 4 && cell.y ===1 ) ||
      (cell.x === 7 && cell.y ===1 ) ||
      (cell.x === 1 && cell.y ===4 ) ||
      (cell.x === 4 && cell.y ===4 ) ||
      (cell.x === 7 && cell.y ===4 ) ||
      (cell.x === 1 && cell.y ===7 ) ||
      (cell.x === 4 && cell.y ===7 ) ||
      (cell.x === 7 && cell.y ===7 );

  }).map(function(cell){

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

    return 	solveGame(cellList);
  }

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

//set cell to the value
function setCell(x,y, value, cellList){
  var cell = getCell(x,y, cellList);
  cell.value = value;


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

  var columnArray = cellList.filter(function(cellInCellList){
    return Math.ceil(cellInCellList.x/3) === Math.ceil(cell.x/3) && Math.ceil(cellInCellList.y/3) === Math.ceil(cell.y/3);
  });	

  return columnArray;
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


function getBusyNumbers(arrayWithArrays){
  if(arrayWithArrays.length > 1){
    var array1 = arrayWithArrays[0];
    var array2 = arrayWithArrays[1];
    var remainingArray = arrayWithArrays.slice(2);

    var mergedArray = array1.map(function(value, index){
      var value2 = array2[index];
      if(value !== undefined ){

        return value;
      }

      else if(value2 !== undefined){
        return value2;
      }

      else {
        return undefined;
      }

    });

    remainingArray.push(mergedArray);
    return getBusyNumbers(remainingArray);

  }

  else {
    return arrayWithArrays[0];
  }
}

//fix: rename
module.exports = {

  solveGame: solveGameFromClient,
  solveGame2: solveGame
}


