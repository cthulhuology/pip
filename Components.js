// Components.js
//
// © 2013 David J. Goehrig
//

Producer = function(x,y,label,output) {
	return Frame.
		send("new","lightblue",x || 100,y || 100,[],[output || "out"]).
		send("label",label || "Producer").
		send("show")
}

Pipe = function(x,y,label,input,output) {
	return Frame.
		send("new","lightgreen",x||100,y||100,[input||"in"],[output||"out"]).
		send("label",label || "Pipe").
		send("show")
}

Consumer = function(x,y,label,input) {
	return Frame.
		send("new","pink",x||100,y||100,[input||"in"],[]).
		send("label",label || "Consumer").
		send("show")
}

Filter = function(x,y,label,input,output,fun) {
	return Frame.
		send("new","lightgreen",x||100,y||100,[input||"in"],[output||"out"]).
		send("label",label || "Filter").
		send("filter",fun.toString()).
		send("show")
}

Transformer = function(x,y,label,input,output,fun) {
	return Frame.
		send("new","lightgreen",x||100,y||100,[input||"in"],[output||"out"]).
		send("label",label || "Transformer").
		send("transform",fun.toString()).
		send("show")
}

Twitter = function(x,y) {
	return Frame.
		send("new","rgb(255,128,225)",x,y,["start","stop"], ["tweets"]).
		send("label","Twitter").
		send("show")	
}

RSS = function(x,y) {
	return Frame.
		send("new","rgb(128,255,225)",x,y,["start","stop"], ["rss"]).
		send("label","RSS").
		send("show")	
}

MIMO = function(x,y,m,n) {
	var _in = []
	var _out = []
	for (var i = 0; i < m; ++i) _in.push("in")
	for (var i = 0; i < n; ++i) _out.push("out")
	return Frame.
		send("new","rgb(255,225,128)",x,y,_in,_out).
		send("label","MIMO").
		send("show")	
}

SIMO = function(x,y,n) {
	return MIMO(x,y,1,n).send("label","SIMO")
}

MISO = function(x,y,m) {
	return MIMO(x,y,m,1).send("label","MISO")
}

