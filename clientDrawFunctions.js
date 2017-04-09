 function updateSudoku(canvas, preNumbers, marker){
		var ctx = canvas.getContext("2d");
		ctx.clearRect(0,0,canvas.width ,canvas.height);
		drawSudoku(canvas, preNumbers, marker);
		var lineWidth = 5;	
		drawSquare(canvas, globalMarkerBox, lineWidth);
}


function drawSquare(canvas, box, lineWidth){
		var ctx = canvas.getContext("2d");
		ctx.beginPath();
		ctx.lineWidth= lineWidth;	
		ctx.rect(box.xpos,box.ypos,box.width,box.height);
		ctx.stroke();
}



function checkOkayKey(keyObject, allowedKeys){
		return allowedKeys.some(function(keyString){return keyObject === keyString; });
}

function checkYDir(keyObject){
		var allowedKeys = ["ArrowDown", "ArrowUp" ];
		return checkOkayKey(keyObject, allowedKeys);

}

function checkNumberKey(keyObject){
		var allowedKeys = ["1", "2", "3","4","5", "6", "7", "8", "9", "0"];
		return checkOkayKey(keyObject, allowedKeys);

}

function checkEnterKey(keyObject){
		var allowedKeys = ["Enter"];
		return checkOkayKey(keyObject, allowedKeys);

}

function checkXDir(keyObject){

		var allowedKeys = ["ArrowLeft", "ArrowRight"];

		return checkOkayKey(keyObject, allowedKeys);

}

function updateGlobalBox(clickString){
		switch(clickString){
				case "ArrowUp":
						globalMarkerBox = generatePositionBox(globalMarkerBox, {x:0, y:-1});
						break;

				case "ArrowDown":
						globalMarkerBox = generatePositionBox(globalMarkerBox, {x:0, y:1});
						break;

				case "ArrowRight":
						globalMarkerBox = generatePositionBox(globalMarkerBox, {x:1, y:0});
						break;

				case "ArrowLeft":
						globalMarkerBox = generatePositionBox(globalMarkerBox, {x:-1, y:0});
						break;

				default:
						console.log("error input given");
						break;

		}

}



function addNumberToPreNumber(clickString){
		var row = Math.round(globalMarkerBox.ypos / globalMarkerBox.height);
		var column = Math.round(globalMarkerBox.xpos / globalMarkerBox.width);

		//remove existing values
		globalPreNumbers = globalPreNumbers.filter(function(cell){
				return !(cell.row === row && cell.column === column);
		});



		globalPreNumbers.push({row:row, column: column, value:parseInt(clickString)});
}

function setCell(row, column,value){

		globalPreNumbers.push({row:row, column:column, value:value});
}


function generatePositionBox(box, directionVector){

		return {width:box.width, height:box.height,xpos:  box.xpos + box.width * directionVector.x,ypos: box.ypos + box.height * directionVector.y} 

}




//numbersToAdd: {row, column, value}
function generateNumberArray(numbersToAdd){	
		numbersToAdd = numbersToAdd || [];
		var numberArr = [];
		for(var i = 0; i < 9; i++){

				for(var j = 0; j < 9; j++){

						//we have to check if we want to add the number
						var maybeNumber = numbersToAdd.find(function(cellObj){
								return cellObj.row === i && cellObj.column === j;

						});

						//if we found a value add it
						var value = (maybeNumber === undefined)? 0 : maybeNumber.value;


						var cell = {row:i, column:j, value:value};	
						numberArr.push(cell);						

				}
		}
		return numberArr;
}


function getAnswer(sudokuArr){
		var arguments = "sudokuToSolve=" + JSON.stringify(sudokuArr);									
		Rx.DOM.get('/solve' + "?" + arguments)
				.subscribe(
								function (xhr) {
										var text = xhr.response;
										globalPreNumbers = JSON.parse(text);


										//removes all the undefined values
										globalPreNumbers = globalPreNumbers.filter(function(cell){
												return cell.value !== undefined;
										});

										updateSudoku(canvas, globalPreNumbers, globalMarkerBox);
										console.log("testing");
								},
								function (err) {
										console.log("err",err);
										// Log the error
								}
						  );

}

function drawSudoku(canvas, preNumbers){

		var lineWidthBorder = 10;
		var lineWidthBigBox = 5;
		var lineWidthSmallBox =2 ;

		//using an object as repr of box border = {width, height, xpos,yos}
		var	border = {width:500, height:500, xpos: 0, ypos:0};


		//border
		drawSquare(canvas, border, lineWidthBorder);

		//big boxes
		var bigBoxes = generateInnerSquares(border);

		bigBoxes.forEach(function(box){
				drawSquare(canvas,box, lineWidthBigBox);
		});


		//text boxes
		var textBoxes = generateAllTextBoxes(border);

		//generate small boxes
		textBoxes.forEach(function(smallBox){
				drawSquare(canvas, smallBox, lineWidthSmallBox);

		});


		//drawText, preNumbers is the numbers given on startup
		var values = generateNumberArray(preNumbers);

		//remove non set values
		var filteredValues = values.filter(function(valueCell){
				return valueCell.value !== 0;

		});

		//draw every value
		filteredValues.forEach(function(valueCell){

				var correspondingBox = textBoxes.find(function(box){

						return box.xpos === box.width * valueCell.column && box.ypos === box.height * valueCell.row;

				});
				drawTextInBox(canvas, correspondingBox, valueCell.value);
		});
		["ArrowDown", "ArrowUp", "ArrowLeft", "ArrowRight" ]



}

function drawTextInBox(canvas, box, text){
		var ctx = canvas.getContext("2d");
		ctx.font = "30px Arial";
		ctx.textBaseline = "middle";
		ctx.textAlign = "center";
		ctx.fillText(text,box.xpos + box.width / 2,box.ypos + box.height /2);

		ctx.stroke();
}

function generateAllTextBoxes(borderBox){
		var bigBoxes = generateInnerSquares(borderBox);
		var textBoxes = [];
		bigBoxes.forEach(function(box){
				textBoxes = textBoxes.concat(generateInnerSquares(box));
		});

		return textBoxes;

}

function generateInnerSquares(box){
		var smallerBoxes = [];
		for(var i = 0; i < 3; i++){
				for(var j = 0; j < 3 ; j++){


						smallerBoxes.push({width: box.width/3, height:box.height/3, xpos: box.xpos + i * box.width/3, ypos : box.ypos + j*box.height/3});
				}
		}


		return smallerBoxes;
}



function showAnswer(){


		getAnswer(globalPreNumbers.filter(function(cell){
				return cell.value !== 0;}));
}
