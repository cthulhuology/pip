// Components.js
//
// © 2013 David J. Goehrig
//

Producer = function(x,y) {
	return Frame.send("new","lightblue",x,y,[],["out"]).send("label","Producer").send("show")
}

Pipe = function(x,y) {
	return Frame.send("new","lightgreen",x,y,["in"],["out"]).send("label","Pipe").send("show")
}

Consumer = function(x,y) {
	return Frame.send("new","pink",x,y,["in"],[]).send("label","Consumer").send("show")
}

Filter = function(x,y) {
	return 
}
