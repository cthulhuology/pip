// Components.js
//
// © 2013 David J. Goehrig
//

Producer = function(x,y,label,output) {
	return Frame.
<<<<<<< HEAD
		send("new","lightblue",x || 100,y || 100,[],[output || "out"]).
=======
		send("new",Colors.blue,x || 100,y || 100,[],[output || "out"]).
>>>>>>> gh-pages
		send("label",label || "Producer").
		send("show")
}

Pipe = function(x,y,label,input,output) {
	return Frame.
<<<<<<< HEAD
		send("new","lightgreen",x||100,y||100,[input||"in"],[output||"out"]).
=======
		send("new",Colors.green.light,x||100,y||100,[input||"in"],[output||"out"]).
>>>>>>> gh-pages
		send("label",label || "Pipe").
		send("show")
}

Consumer = function(x,y,label,input) {
	return Frame.
<<<<<<< HEAD
		send("new","pink",x||100,y||100,[input||"in"],[]).
=======
		send("new",Colors.red,x||100,y||100,[input||"in"],[]).
>>>>>>> gh-pages
		send("label",label || "Consumer").
		send("show")
}

Filter = function(x,y,label,input,output,fun) {
	return Frame.
<<<<<<< HEAD
		send("new","lightgreen",x||100,y||100,[input||"in"],[output||"out"]).
=======
		send("new",Colors.green.dark,x||100,y||100,[input||"in"],[output||"out"]).
>>>>>>> gh-pages
		send("label",label || "Filter").
		send("filter",fun.toString()).
		send("show")
}

Transformer = function(x,y,label,input,output,fun) {
	return Frame.
<<<<<<< HEAD
		send("new","lightgreen",x||100,y||100,[input||"in"],[output||"out"]).
=======
		send("new",Colors.green.dark,x||100,y||100,[input||"in"],[output||"out"]).
>>>>>>> gh-pages
		send("label",label || "Transformer").
		send("transform",fun.toString()).
		send("show")
}

Twitter = function(x,y) {
	return Frame.
<<<<<<< HEAD
		send("new","rgb(255,128,225)",x,y,["start","stop"], ["tweets"]).
=======
		send("new",Colors.cyan,x,y,["start","stop"], ["tweets"]).
>>>>>>> gh-pages
		send("label","Twitter").
		send("show")	
}

RSS = function(x,y) {
	return Frame.
<<<<<<< HEAD
		send("new","rgb(128,255,225)",x,y,["start","stop"], ["rss"]).
=======
		send("new",Colors.cyan,x,y,["start","stop"], ["rss"]).
>>>>>>> gh-pages
		send("label","RSS").
		send("show")	
}

<<<<<<< HEAD
MIMO = function(x,y,m,n) {
=======
MIMO = function(x,y,m,n,color) {
>>>>>>> gh-pages
	var _in = []
	var _out = []
	for (var i = 0; i < m; ++i) _in.push("in")
	for (var i = 0; i < n; ++i) _out.push("out")
	return Frame.
<<<<<<< HEAD
		send("new","rgb(255,225,128)",x,y,_in,_out).
=======
		send("new",color||Colors.brown,x,y,_in,_out).
>>>>>>> gh-pages
		send("label","MIMO").
		send("show")	
}

SIMO = function(x,y,n) {
<<<<<<< HEAD
	return MIMO(x,y,1,n).send("label","SIMO")
}

MISO = function(x,y,m) {
	return MIMO(x,y,m,1).send("label","MISO")
=======
	return MIMO(x,y,1,n, Colors.yellow).send("label","SIMO")
}

MISO = function(x,y,m) {
	return MIMO(x,y,m,1, Colors.organe).send("label","MISO")
>>>>>>> gh-pages
}

