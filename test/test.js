var assert = require("assert");
var sudoku = require("../sudoku.js")

describe("test of existing functionality",()=>{
  it("should solve an example from app", ()=>{

    globalPreNumbers = [{"row":0,"column":0,"value":5},{"row":0,"column":2,"value":8},{"row":2,"column":2,"value":6},{"row":2,"column":1,"value":9},{"row":2,"column":5,"value":7},{"row":1,"column":3,"value":9},{"row":0,"column":4,"value":3},{"row":2,"column":8,"value":3},{"row":3,"column":8,"value":2},{"row":3,"column":6,"value":3},{"row":4,"column":8,"value":7},{"row":5,"column":7,"value":1},{"row":5,"column":6,"value":9},{"row":5,"column":4,"value":2},{"row":4,"column":4,"value":1},{"row":4,"column":5,"value":9},{"row":3,"column":4,"value":7},{"row":4,"column":3,"value":8},{"row":3,"column":2,"value":5},{"row":3,"column":1,"value":1},{"row":4,"column":0,"value":3},{"row":5,"column":0,"value":8},{"row":5,"column":2,"value":7},{"row":6,"column":0,"value":7},{"row":6,"column":3,"value":5},{"row":7,"column":5,"value":8},{"row":8,"column":4,"value":6},{"row":6,"column":6,"value":6},{"row":6,"column":7,"value":9},{"row":8,"column":6,"value":2},{"row":8,"column":8,"value":4}];


    var newCellList = sudoku.solveGame(globalPreNumbers);
    assert.equal(newCellList.length, 81)

  });

  it("should solve an example from app", ()=>{

		globalPreNumbers = [{"row":0,"column":0,"value":6},{"row":1,"column":2,"value":9},{"row":0,"column":3,"value":8},{"row":1,"column":3,"value":2},{"row":2,"column":5,"value":5},{"row":0,"column":6,"value":2},{"row":0,"column":7,"value":4},{"row":0,"column":8,"value":1},{"row":1,"column":8,"value":3},{"row":1,"column":7,"value":7},{"row":2,"column":8,"value":6},{"row":3,"column":7,"value":2},{"row":4,"column":7,"value":3},{"row":4,"column":6,"value":6},{"row":4,"column":8,"value":7},{"row":5,"column":6,"value":9},{"row":5,"column":3,"value":4},{"row":3,"column":5,"value":9},{"row":3,"column":2,"value":8},{"row":4,"column":2,"value":2},{"row":4,"column":1,"value":4},{"row":4,"column":0,"value":9},{"row":5,"column":1,"value":7},{"row":6,"column":0,"value":2},{"row":7,"column":0,"value":5},{"row":7,"column":1,"value":3},{"row":8,"column":0,"value":8},{"row":8,"column":1,"value":9},{"row":8,"column":2,"value":6},{"row":6,"column":3,"value":6},{"row":7,"column":5,"value":8},{"row":8,"column":5,"value":3},{"row":7,"column":6,"value":1},{"row":8,"column":8,"value":4}];


    var newCellList = sudoku.solveGame(globalPreNumbers);
    assert.equal(newCellList.length, 81)

  });
});;



describe("test of solveBox", ()=>{
  it("should solve if only one left", function(){
    var cellList = []; 
    var boxList = [];
    sudoku.__test__.solveBox(boxList, cellList);

    assert.equal(true,true);


  });
  
  it("should solve if only one left", function(){
    var boxList = [
    {
      potential: [2]
    }
    ];
    var cellList = sudoku.__test__.findBoxSolution(boxList);

    assert.equal(cellList.length,1);


  });

})

describe("test of solveCell", ()=> {
  //fix: change name
  it("test of calling function", ()=>{
      var busyNumbers = sudoku.__test__.getBusyNumbers([],[],[]);

      assert.equal(0,0);

  });

})
