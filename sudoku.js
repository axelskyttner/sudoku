Cell = function(x,y){
this.x = x;
this.y = y;
this.value = undefined;
this.potential= [];

}
var numberList = [1,2,3,4,5,6,7,8,9];

var cellList = [];
for(var i = 1; i < 10; i++){
	
	for(var j = 1; j < 10 ; j++){
		cell = new Cell(i,j);
		cellList.push(cell);
	}

}
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

function solveGame(cellList){
	cellList.forEach(function(cell){
		solveCell(cell, cellList);
			});

	var filteredList = cellList.filter(function(cell){
		return cell.potential.length === 1 && cell.value === undefined;
});
	filteredList.forEach(function(cell){
		cell.value = cell.potential.pop();
	});

	var unsolvedFlag = cellList.some(function(cell){
		return cell.value === undefined;
	});

	if(unsolvedFlag){
		return 	solveGame(cellList);
	}

	else{
		return cellList;
	}
//var numberOfFreeElementsList = solvedList.filter(function(array){
	//	return getNumberOfFreeElements(array) < 3;
	//});

//	console.log("numberOfFreeElementsList", numberOfFreeElementsList);

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

function createGame(){
	setCell(1,4, 2);
	setCell(1,5,6);
	setCell(1,7,7);
	setCell(1,9,1);
	//setCell(1,2,3);

	setCell(2,1,6);
	setCell(2,2,8);
	//setCell(2,3,2);
	setCell(2,5,7);
	setCell(2,8,9);

	setCell(3,1,1);
	setCell(3,2,9);
	setCell(3,6,4);
	setCell(3,7,5);

	setCell(4,1,8);
	setCell(4,2,2);
	setCell(4,4,1);
	setCell(4,8,4);
	
	setCell(5,3,4);
	setCell(5,4,6);
	setCell(5,6,2);
	setCell(5,7,9);

	setCell(6,2,5);
	setCell(6,6,3);
	setCell(6,8,2);
	setCell(6,9,8);

	
	setCell(7,3,9);
	setCell(7,4,3);
	setCell(7,8,7);
	setCell(7,9,4);

	setCell(8,2,4);
	setCell(8,5,5);
	setCell(8,8,3);
	setCell(8,9,6);

	

	setCell(9,1,7);
	setCell(9,3,3);
	setCell(9,5,1);
	setCell(9,6,8);
	



}

function setCell(x,y, value){
	var cell = getCell(x,y);
	cell.value = value;


}


function getCell(x, y){
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

createGame();
console.log("game", cellList);

solveGame(cellList);

console.log("game after solve", cellList);

