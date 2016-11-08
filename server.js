var app = require("express")();


app.get("/",function(req,res){
	res.sendFile(__dirname + "/index.html");

});
app.get("/rx.dom.js", function(req,res){

	res.sendFile(__dirname + "/node_modules/rxjs/rx.dom.js");
});

app.get("/rx.js", function(req,res){

	res.sendFile(__dirname + "/node_modules/rx/dist/rx.all.js");
});
app.listen(3000,function(){
	console.log("listening on port 3000");
});
