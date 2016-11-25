var app = require("express")();
var sudokuSolver = require("./sudoku.js");

app.get("/",function(req,res){
	res.sendFile(__dirname + "/index.html");

});

app.get("/solve", function(req,res){
		var sudokuToSolve = JSON.parse(req.query.sudokuToSolve);
		
		var solvedSudoku = sudokuSolver.solveGame(sudokuToSolve);

		solvedSudokuString = JSON.stringify(solvedSudoku);
	res.send(solvedSudokuString);
});
app.get("/rx-dom.js", function(req,res){

	res.sendFile(__dirname + "/node_modules/rx-dom/dist/rx.dom.js");
});

app.get("/rx.js", function(req,res){

	res.sendFile(__dirname + "/node_modules/rx/dist/rx.all.js");
});

app.listen(3000,function(){
	console.log("listening on port 3000");
});
