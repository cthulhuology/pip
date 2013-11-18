// Base.js
//
// © 2012,2013 David J. Goehrig <dave@dloh.org>
//
Object.prototype.list = function() {
	return Array.prototype.slice.apply(this,[0])
}

Object.prototype.keys = function() {
	var keys = []
	for (x in this) if (this.hasOwnProperty(x)) keys.push(x)
	return keys
}

// We need to do this because invoking a function in a top level passes window as this
Function.prototype.send = function(message) {
	return this.apply(this,message)
}

// Send a list of arguments to a function to evaluate itself with
Function.prototype.resend = function(proto,message) {
	return proto.apply(this,message)
}

// Sends a message to the object after a given timeout
Function.prototype.after = function(timeout) {
	var message = arguments.list().slice(1)
	var self = this
	setTimeout( function() { self.send(message) }, timeout )
}

// Sends a message to the object when the condition holds true
Function.prototype.when = function(condition) {
	var self = this
	var message = arguments.list()
	if (! condition.apply(self,[]) ) {
		setTimeout( function() {  self.when.apply(self,message) }, 1000/60 )
		return self
	}
	return self.send(message.slice(1))
}

Function.prototype.whenever = function(condition) {
	var self = this
	var message = arguments.list()
	if (condition.apply(self,[])) self.send(message.slice(1))
	setTimeout( function() { self.whenever.apply(self,message) }, 1000/60 )
}

Function.prototype.clone = function() {
	var proto = this
	return function() { return proto.apply(arguments.callee, arguments.list()) }
}

String.prototype.post = function(D,F) {
	var R = XMLHttpRequest ? new XMLHttpRequest(): _doc.createRequest()
	R.onreadystatechange = function () {
		if (this.readyState != 4 || typeof(F) != "function") return false
		if (this.status == 404) F(null)
		if (this.status == 200) F(this.responseText)
	}
	R.open('POST',this,true)
	R.setRequestHeader('Content-Type','application/json')
	R.send(D ? D : '')
	return this
}

String.prototype.get = function(F) {
	var R = XMLHttpRequest ? new XMLHttpRequest(): _doc.createRequest()
	R.onreadystatechange = function () {
		if (this.readyState != 4 || typeof(F) != "function") return false
		if (this.status == 404) F(null)
		if (this.status == 200) {
			console.log(this)
			try {
				if (this.responseXML) return F(this.responseXML)
				else if (JSON.parse(this.responseText)) return F(JSON.parse(this.responseText))
			} catch(e) {		
				F(this.responseText)
			}
		}
	}
	R.open("GET",this,true)
	R.send()
	return this
}

String.prototype.connect = function(F) {
	var ws = new WebSocket(this)
	ws.url = this
	ws.addEventListener('message',F)
	ws.addEventListener('open',F)
	ws.addEventListener('close',F)
	ws.addEventListener('error',F)
	return ws
}
