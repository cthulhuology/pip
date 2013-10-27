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

// Sends a message to the object after a given timeout
Function.prototype.after = function(timeout) {
	var message = arguments.list().slice(1)
	var self = this
	setTimeout( function() { self.resend(message) }, timeout )
}

// Sends a message to the object when the condition holds true
Function.prototype.when = function( condition ) {
	var self = this
	console.log(self)
	var message = arguments.list()
	if (! condition.apply(self,[]) ) {
		setTimeout( function() {  self.when.apply(self,message) }, 500 )
		return self
	}
	return self.resend(message.slice(1))
}

Function.prototype.clone = function() {
	var src = this.toString()
	var definition = src.substr(0,src.indexOf("{")).match(/\(([^)]+)\)/)[1].split(/,\s*/)
	definition.push(src.substr(1+src.indexOf("{"), src.lastIndexOf("}")-src.indexOf("{")-1))
	return Function.prototype.constructor.apply(this, definition)
}


