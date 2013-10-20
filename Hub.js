// Hub.js
//
// © 2012,2013 David J. Goehrig <dave@dloh.org>
//
// The hub routes messages to objects that subscribe to a selector
// the only two resevered selectors are 'subscribe' an 'unsubscribe'
// which refer directly to the behavior of the Hub itself.

// Useful for converting arguments to an array
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

// Resends messages to all of the attached objects, allows a basic level of routing
Hub = function(method) {
	var message = Array.prototype.slice.apply(arguments,[0])
	switch (method) {
	case 'subscribe':
		var selector = message[1]
		var target = message[2]
		if (typeof(Hub.queues[selector]) != "object") Hub.queues[selector] = []		// create the queue if it doesn't exist
		if (Hub.queues[selector].indexOf(target) < 0) Hub.queues[selector].push(target)	// no duplicate subscriptions
		break
	case 'unsubscribe':
		var selector = message[1]
		var target = message[2]
		if (typeof(Hub.queues[selector]) != "object") return;				// if the queue doesn't exist return
		if (Hub.queues[selector].indexOf(target) < 0) return;				// if the target isn't subscribed return
		Hub.queues[selector].splice(Hub.queues[selector].indexOf(target),1)		// remove target from queue
		break
	default:										// publish by default
		var selector = message[0]
		if (typeof(Hub.queues[selector]) != "object") return;						// don't send to empty lists
		for (var i = 0; i < Hub.queues[selector].length; ++i) Hub.queues[selector][i].resend(message)	// resend message to each
		break
	}
}
Hub.queues = {}
