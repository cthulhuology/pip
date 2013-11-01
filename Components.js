// Components.js
//
// © 2013 David J. Goehrig
//

Producer = function(x,y,label,output) {
	return Frame("new",Colors.blue,x || 100,y || 100,[],[output || "out"])
		("label",label || "Producer")
		("show")
}

Pipe = function(x,y,label,input,output) {
	return Frame("new",Colors.green.light,x||100,y||100,[input||"in"],[output||"out"])
		("label",label || "Pipe")
		("show")
}

Consumer = function(x,y,label,input) {
	return Frame("new",Colors.red,x||100,y||100,[input||"in"],[])
		("label",label || "Consumer")
		("show")
}

Filter = function(x,y,label,input,output,fun) {
	return Frame("new",Colors.green.dark,x||100,y||100,[input||"in"],[output||"out"])
		("label",label || "Filter")
		("filter",fun.toString())
		("show")
}

Transformer = function(x,y,label,input,output,fun) {
	return Frame("new",Colors.green.dark,x||100,y||100,[input||"in"],[output||"out"])
		("label",label || "Transformer")
		("transform",fun.toString())
		("show")
}

Twitter = function(x,y) {
	return Frame("new",Colors.cyan,x||100,y||100,["start","stop"], ["tweets"])
		("label","Twitter")
		("show")	
}

RSS = function(x,y) {
	return Frame("new",Colors.cyan,x||100,y||100,["start","stop"], ["rss"])
		("label","RSS")
		("show")	
}

MIMO = function(x,y,m,n,color) {
	var _in = []
	var _out = []
	for (var i = 0; i < m; ++i) _in.push("in")
	for (var i = 0; i < n; ++i) _out.push("out")
	return Frame("new",color||Colors.brown,x||100,y||100,_in,_out)
		("label","MIMO")
		("show")	
}

SIMO = function(x,y,n) {
	return MIMO(x||100,y||100,1,n||0, Colors.yellow)("label","SIMO")
}

MISO = function(x,y,m) {
	return MIMO(x||100,y||100,m||0,1, Colors.orange)("label","MISO")
}

