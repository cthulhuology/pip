// Message.js
//
// © 2012,2013 David J. Goehrig <dave@dloh.org>
//
// Resends messages to all of the attached objects, allows a basic level of routing
//
Message = function(method) {
	var message = []
	if (typeof(method) == 'object' && method.type == 'message') {
		try {
			message = JSON.parse(method.data)
			method = message[0]
		} catch (e) {
			console.error(e)
		}
	} else {
		message = arguments.list()
	}
	var selector = message[0]
	if (typeof(Message.queues[selector]) == "object") 
		for (var i = 0; i < Message.queues[selector].length; ++i) try {
			 Message.queues[selector][i].resend(message)	// resend message to each
		} catch (e) {
			console.log(e)
		} 
	// proxy for websockets 
	for (var i = 0; i < Message.sockets.length; ++i) 
		if (Message.sockets[i].methods.indexOf(selector) >= 0)
			Message.sockets[i].send(JSON.stringify(message))
	return this
}

Message.sockets = []
Message.queues = {}

Message.attach = function(url) {
	var ws = new WebSocket(url)
	ws.methods = arguments.list().slice(1)
	ws.addEventListener('message', Message)
	ws.addEventListener('open', Message)
	ws.addEventListener('close', Message)
	ws.addEventListener('error', Message)
	Message.sockets.push(ws)
	return this
}

Function.prototype.ack = function() {
	var methods = arguments.list()
	for (var i = 0; i < methods.length; ++i) {
		if (typeof(Message.queues[methods[i]]) != 'object')
			Message.queues[methods[i]] = []
		if (Message.queues[methods[i]].indexOf(this) < 0)
			Message.queues[methods[i]].push(this)
	}
	return this
}

Function.prototype.nack = function() {
	var methods = arguments.list()
	for (var i = 0; i < methods.length; ++i) {
		if (typeof(Message.queues[methods[i]]) != "object") continue
		if (Message.queues[methods[i]].indexOf(this) < 0) continue
		Message.queues[methods[i]].splice(Message.queues[methods[i]].indexOf(this),1)
	}
	return this
}
