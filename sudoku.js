Cell = function(x,y){
this.x = x;
this.y = y;
this.value = undefined;
this.potential= [];

}
var numberList = [1,2,3,4,5,6,7,8,9];

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



function solveGame(cellList){
	//this command will find every value that has to be because no other values fit	
		cellList.forEach(function(cell){
		solveCell(cell, cellList);
			});

	//we can also use the fact that given that we have to put in a number, where in the row can that number be. 			
	//debug, getting the top right box to find number 9
	var topRightBox = getSquare(new Cell(1,7), cellList);
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


	console.log("uniqueBoxList", boxList.length);

	boxList.forEach(function(box){
		solveBox(box,cellList);

	});
	
	var filteredList = cellList.filter(function(cell){
		return cell.potential.length === 1 && cell.value === undefined;
	});
	
	filteredList.forEach(function(cell){
		cell.value = cell.potential.pop();
	});
	
	//check if there is any cells left unsolved
	var unsolvedFlag = cellList.some(function(cell){
		return cell.value === undefined;
	});
	
	//added false while debug
	if(unsolvedFlag ){
		 
		return 	solveGame(cellList);
	}

	else{
		return cellList;
	}
//var numberOfFreeElementsList = solvedList.filter(function(array){
	//	return getNumberOfFreeElements(array) < 3;
	//});


};

function getNumberOfFreeElements(array){
	var filteredArray = array.filter(function(cell){
	
		return cell.value === undefined;

	});
	return filteredArray.length;
	

}

function setCellToMissingValue(celllist){
	cellList.forEach(function(cell, index){

		
	});
	
}

function solveGameFromClient(sudokuFromClient){

	var cellList = [];
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

function createGame(){

	var cellList = [];
	for(var i = 1; i < 10; i++){
		
		for(var j = 1; j < 10 ; j++){
			cell = new Cell(i,j);
			cellList.push(cell);
		}
	
	}
	setCell(1,4,2,cellList);
	setCell(1,5,6,cellList);
	setCell(1,7,7,cellList);
	setCell(1,9,1,cellList);
	//setCell(1,2,cellList)3);

	setCell(2,1,6,cellList);
	setCell(2,2,8,cellList);
	//setCell(2,3,cellList)2);
	setCell(2,5,7,cellList);
	setCell(2,8,9,cellList);

	setCell(3,1,1,cellList);
	setCell(3,2,9,cellList);
	setCell(3,6,4,cellList);
	setCell(3,7,5,cellList);

	setCell(4,1,8,cellList);
	setCell(4,2,2,cellList);
	setCell(4,4,1,cellList);
	setCell(4,8,4,cellList);
	
	setCell(5,3,4,cellList);
	setCell(5,4,6,cellList);
	setCell(5,6,2,cellList);
	setCell(5,7,9,cellList);

	setCell(6,2,5,cellList);
	setCell(6,6,3,cellList);
	setCell(6,8,2,cellList);
	setCell(6,9,8,cellList);

	
	setCell(7,3,9,cellList);
	setCell(7,4,3,cellList);
	setCell(7,8,7,cellList);
	setCell(7,9,4,cellList);

	setCell(8,2,4,cellList);
	setCell(8,5,5,cellList);
	setCell(8,8,3,cellList);
	setCell(8,9,6,cellList);
	
	setCell(9,1,7,cellList);
	setCell(9,3,3,cellList);
	setCell(9,5,1,cellList);
	setCell(9,6,8,cellList);
	

	return cellList;

}

function setCell(x,y, value, cellList){
	var cell = getCell(x,y, cellList);
	cell.value = value;


}


function getCell(x, y, cellList){
	var filteredArray = cellList.filter(function(cell){
		return cell.x === x && cell.y === y;
	});
	return filteredArray[0];
}

function getRow(cell, cellList){
	var rowArray = cellList.filter(function(cellInCellList){
		return cell.x === cellInCellList.x;
	});	
	return rowArray;
}

function getColumn(cell, cellList){

	var columnArray = cellList.filter(function(cellInCellList){
		return cell.y === cellInCellList.y;
	});	
	return columnArray;
}

function getSquare(cell, cellList){

	var columnArray = cellList.filter(function(cellInCellList){
		return Math.ceil(cellInCellList.x/3) === Math.ceil(cell.x/3) && Math.ceil(cellInCellList.y/3) === Math.ceil(cell.y/3);
	});	

	return columnArray;
}

function sortArray(array){
	//var sortedArray = [];
	var sortedArray2 = array.slice();
	//for(var i = 0; i < 10; i++){
	//	sortedArray.push(undefined);
	//}
	
//	var filteredArray = array.filter(function(cell){
//		return cell.value !== undefined;
//	});

	
//	array.forEach(function(cell,index, array){
//
//		if(cell.value !== undefined){
//
//			var savedCell = sortedArray2[cell.value -1];
//			sortedArray2[cell.value -1] = cell;
//			sortedArray2[index] = savedCell;
//		}
//
//	});
	
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

module.exports = {

	solveGame: solveGameFromClient
}

//var cellList = createGame();
//
//solveGame(cellList);
//

