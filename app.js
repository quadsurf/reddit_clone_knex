var express = require("express"),
	app = express(),
	methodOverride = require("method-override"),
	morgan = require("morgan"),
	bodyParser = require("body-parser"),
	Upload = require('upload-file');

require("locus");

app.set("view engine", "jade");
app.use(express.static(__dirname + "/public"));
app.use(morgan("tiny"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(methodOverride("_method"));

app.get("/", function(req, res){
	res.render("statics/home")
});

// Routes
usersRouter = require("./routes/users");
app.use("/users", usersRouter);


// app.get("*", function(req,res){
//   res.render("404");
// });

app.listen(3001, function(){
  console.log("Server is listening on port 3001");
});
