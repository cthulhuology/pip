// Base.js
//
// © 2012,2013 David J. Goehrig <dave@dloh.org>
//
Object.prototype.list = function() {
	return Array.prototype.slice.apply(this,[0])
}

// We need to do this because invoking a function in a top level passes window as this
Function.prototype.send = function() {
	return this.apply(this,arguments.list())
}

// Send a list of arguments to a function to evaluate itself with
Function.prototype.resend = function(message) {
	return this.apply(this,message)
}

Function.prototype.clone = function() {
	var src = this.toString()
	var definition = src.substr(0,src.indexOf("{")).match(/\(([^)]+)\)/)[1].split(/,\s*/)
	definition.push(src.substr(1+src.indexOf("{"), src.lastIndexOf("}")-src.indexOf("{")-1))
	return Function.prototype.constructor.apply(this, definition)
}

