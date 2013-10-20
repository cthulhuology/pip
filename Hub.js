// Hub.js
//
// © 2012,2013 David J. Goehrig <dave@dloh.org>
//
// The hub routes messages to objects that subscribe to a selector
// the only two resevered selectors are 'subscribe' an 'unsubscribe'
// which refer directly to the behavior of the Hub itself.

// Resends messages to all of the attached objects, allows a basic level of routing
//
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
