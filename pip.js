// The MIT License (MIT)
// 
// Copyright (c) 2013 Dave Goehrig
// 
// Permission is hereby granted, free of charge, to any person obtaining a copy of
// this software and associated documentation files (the "Software"), to deal in
// the Software without restriction, including without limitation the rights to
// use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
// the Software, and to permit persons to whom the Software is furnished to do so,
// subject to the following conditions:
// 
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
// 
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
// FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
// COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
// IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
// CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
//
//
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
			console.log(method)
		} catch (e) {
			console.error(e)
		}
	} else {
		message = arguments.list()
	}
	var selector = message[0]
	if (typeof(Message.queues[selector]) == "object") 
		for (var i = 0; i < Message.queues[selector].length; ++i) try {
			 Message.queues[selector][i].send(message)	// send message to each
		} catch (e) {
			console.log(e)
		} 
	// proxy for websockets 
	for (var i = 0; i < Message.sockets.length; ++i) 
		if (Message.sockets[i].methods.indexOf(selector) >= 0 || Message.sockets[i].methods.indexOf('*') >= 0)
			Message.sockets[i].send(JSON.stringify(message))
	return this
}

Message.sockets = []
Message.queues = {}

Message.attach = function(url) {
	var ws = url.connect(Message)
	ws.methods = arguments.list().slice(1)
	Message.sockets.push(ws)
	return this
}

Message.detach = function(url) {
	for (var i = 0; i < Message.sockets.length; ++i) {
		if (Message.sockets[i].url == url) {
			Message.sockets[i].close()
			Message.sockets.splice(i,1)	// remove the socket from the list
		}
	}
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
// Screen.js
//
// © 2012,2013 David J. Goehrig <dave@dloh.org>
// 
// Screen and Canvas wrap the Drawing context and HTML element respectively 
// We extend some of the behavior to fill in gaps in the API
//

Canvas = document.querySelector('#canvas')
Canvas.width = window.innerWidth
Canvas.height = window.innerHeight
Canvas.style.position = 'absolute'
Canvas.style.top = 0
Canvas.style.left = 0
Canvas.style.width = window.innerWidth
Canvas.style.height = window.innerHeight

Screen = (function(method) {
	var screen = Canvas.getContext('2d')
	var message = arguments.list()
	switch (method) {
	case 'arc':
		var x = message[1]
		var y = message[2]
		var r = message[3]
		var theta = message[4]
		var phi = message[5]
		var counter = message[6]
		screen.arc(x - this.x, y - this.y, r, theta, phi,counter)
		return this
	case 'beginPath':
		screen.beginPath()
		return this
	case 'bezierCurveTo':
		var cp1x = message[1]
		var cp1y = message[2]
		var cp2x = message[3]
		var cp2y = message[4]
		var x = message[5]
		var y = message[6]
		screen.bezierCurveTo(
			cp1x - this.x, cp1y - this.y,
			cp2x - this.x, cp2y - this.y,
			x - this.x, y - this.y )
		return this
	case 'circle':
		var x = message[1]
		var y = message[2]
		var r = message[3]
		screen.arc(x - this.x,y - this.y,r,0,Math.PI*2)
		return this
	case 'clearRect':
		var x = message[1]
		var y = message[2]
		var w = message[3]
		var h = message[4]
		screen.clearRect(x,y,w,h)
		return this
	case 'closePath':
		screen.closePath()
		return this
	case 'fill':
		screen.fill()
		return this
	case 'fillStyle':
		screen.fillStyle = message[1]
		return this
	case 'fillText':
		var txt = message[1]
		var x = message[2]
		var y = message[3]
		screen.fillText(txt, x - this.x, y - this.y)
		return this
	case 'font':
		screen.font = message[1]
		return this
	case 'hide':
		var widget = message[1]
		if (Screen.widgets.indexOf(widget) < 0 ) return;
		Screen.widgets.splice(Screen.widgets.indexOf(widget),1)
		return this
	case 'lineTo':
		var x = message[1]
		var y = message[2]
		screen.lineTo(x - this.x, y - this.y)
		return this
	case 'measureText':
		var txt = message[1]
		return screen.measureText(txt).width
	case 'moveTo':
		var x = message[1]
		var y = message[2]
		screen.moveTo(x - this.x, y - this.y)
		return this
	case 'rect':
		var x = message[1]
		var y = message[2]
		var w = message[3]
		var h = message[4]
		screen.rect(x - this.x,y - this.y,w,h)
		return this
	case 'restore':
		screen.restore()
		return this
	case 'save':
		screen.save()
		return this
	case 'scroll':
		this.x += message[1]
		this.y += message[2]
		return this
	case 'show':
		var widget = message[1]
		if (Screen.widgets.indexOf(widget) < 0) {
			Screen.widgets.push(widget)
		}
		return this
	case 'stroke':
		screen.stroke()
		return this
	case 'strokeStyle':
		screen.strokeStyle = message[1]
		return this
	default:
		console.log('TODO: ' + method + ' implementation')
		return this
	}
}).clone()

onFrame = (function(){
	return window.requestAnimationFrame	||
	window.webkitRequestAnimationFrame	||
	window.mozRequestAnimationFrame		||
	function( callback ){
		window.setTimeout(callback, 1000 / 60);
	};
})();

Screen.x = 0
Screen.y = 0

Screen.widgets = []		// an array of widgets on screen

Screen.render = function() {
	Screen('clearRect',0,0,Canvas.width,Canvas.height)
	for (var i = 0; i < Screen.widgets.length; ++i) 
		try {
			Screen.widgets[i]('draw')		// draw method
		} catch (e) {
			console.log('failed to draw widget ' + i, e)
		}
	onFrame(Screen.render)
}

Screen.ack('scroll')

window.onload = function() {
	onFrame(Screen.render)
}
// Mouse.js
// 
// © 2012,2013 David J Goehrig
// 
// Manages mouse events, requires Hub.js & Screen.js beloaded first
// 

Mouse = function(e) {
	e.preventDefault()
	e.cancelBubble = true;
	switch(e.type) {
		case 'contextmenu':
			console.log(e)
		case 'mousedown':
			Message('down', e.clientX + Screen.x, e.clientY + Screen.y, e.button)
			var now = new Date();
			if (now - Mouse.last < 300) {
				console.log("doubleclick event detected")	
				Message('doubleclick', e.clientX + Screen.x, e.clientY + Screen.y, e.button)
			}
			Mouse.last = now
			break
		case 'mousemove': 
			Message('move', e.clientX + Screen.x, e.clientY + Screen.y)
			break
		case 'mouseup':
			Message('up', e.clientX + Screen.x, e.clientY + Screen.y, e.button)
			break
		case 'wheel':
			Message('scroll', e.deltaX, e.deltaY)
			break
		case 'mousewheel':
			Message('scroll', -e.wheelDeltaX, -e.wheelDeltaY)
			break
		default:
			// ignore this type of event
	}
	return true;
}

window.addEventListener('mousedown',Mouse,true)
window.addEventListener('mousemove',Mouse,true)
window.addEventListener('mouseup',Mouse,true)
window.addEventListener('wheel',Mouse,true)
window.addEventListener('mousewheel',Mouse,true)
window.addEventListener('contextmenu',Mouse,true)
Colors = {
	Text : {
		light : '#f0f1e2',
		dark : '#393a14',
	},
	red : '#d34839',
	brown : '#975529',
	blue: '#6115eb',
	cyan: '#71858f',
	green : { 
		light: '#6dab55',
		dark: '#789638',
	},
	yellow: '#cc9434',
	orange: '#cc6634',
}
// Widget.js
//
// © 2012, 2013 David J. Goehrig <dave@dloh.org>
//

Widget = function(method) {
	var message = arguments.list()
	switch(method) {
	case 'has':
		for (var i = 1; i < message.length; i += 2)
			this[message[i]] = message[i+1]
		return this
	case 'at':
		this.x = message[1]
		this.y = message[2]
		return this
	case 'by': 
		this.width = message[1]
		this.height = message[2]
		return this
	case 'down':
		var x = message[1]
		var y = message[2]
		if ( x < this.x || x > this.x + this.width || y < this.y || y > this.y + this.height) return;
		this.dx = x - this.x
		this.dy = y - this.y
		this.ack('up','move').nack('down')
		return this
	case 'move':
		this.x = message[1] - this.dx
		this.y = message[2] - this.dy
		return this
	case 'up':
		this.ack('down').nack('up','move')
		return this
	case 'show':
		Screen('show',this)
		return this
	case 'hide':
		Screen('hide',this)
		return this
	case 'ack':
		this.ack.apply(this,message.slice(1))
		return this
	case 'nack':
		this.ack.apply(this,message.slice(1))
		return this
	case 'on':
		var o = message[1]
		return !( o.x + o.width < this.x || o.x > this.x + this.width || o.y + o.height < this.y || o.y > this.y + this.height)
	default:
		if (typeof(this[method]) == 'function')
			return this[method].apply(this,message.slice(1))
		return this
	}	
}
// Console.js
//
// © 2013 David J. Goehrig <dave@dloh.org>
//

Console = function(method) {
	var message = arguments.list()
	var self = this
	switch (method) {
	case 'new':
		var self = Console.clone()
		var x = message[1]
		var y = message[2]
		var w = message[3]
		var h = message[4]
		self.x = x || 10
		self.y = y || 10
		self.width = w || 20 * 40
		self.height = h || 20 * 25
		self.lines = []
		self.ack('down')
		return self	
	case 'draw':
		Screen('save')
			('font', '16px Monaco')
			('beginPath')
			('strokeStyle','black')
			('rect',self.x,self.y,self.width,self.height)
			('closePath')
			('stroke')
		for (var i = 0; i < self.lines.length; ++i)
			Screen('fillText',self.lines[i], self.x+6, self.y + 26 + i * 20)
		Screen('restore')
		return self
	case 'add':
		self.lines.push(message[1])
		while( self.lines.length > 24) self.lines.shift()
	default:
		return self.resend(Widget,message);
	}
}


// Frame.js
// 
// © 2012,2013 David J. Goehrig <dave@dloh.org>
// 
// Renders an I/O frame for representing a process
//

Frame = function(method) {
	var message = arguments.list()
	var self = this
	switch(method) {
	case 'draw':
		if (this.drawing) return;
		this.drawing = true
		var x = this.x
		var y = this.y
		var inputs = this.inputs
		var outputs = this.outputs
		var height = (Math.max(inputs.length,outputs.length) + 1) * 15
		var width = 0	
		Screen('font','12px Arial')
		for (var i = 0; i < inputs.length; ++i) width = Math.max(width, Screen('measureText',inputs[i].text) * 2)
		for (var i = 0; i < outputs.length; ++i) width = Math.max(width, Screen('measureText',outputs[i].text) * 2)
		width += 40 
		this.width = width
		this.height = height
		Screen('save')	
			('beginPath')
			('moveTo',x,y)
			('lineTo',x+width,y)
		for (var i = 0; i < outputs.length; ++i) {
			var dy = height / (outputs.length + 1)
			// Adjust positions if we moved
			if (this.outputs[i].x == this.outputs[i].tx && this.outputs[i].y == this.outputs[i].ty) {
				this.outputs[i].tx = this.outputs[i].x = x+width	// capture center
				this.outputs[i].ty = this.outputs[i].y = y+i*dy + dy	// of the output tab
			} else {
				this.outputs[i].x = x+width	// capture center
				this.outputs[i].y = y+i*dy + dy	// of the output tab
			}
			// animate snap back if we're unattached
			if (!this.dragging && !this.outputs[i].target && (this.outputs[i].tx != this.outputs[i].x || this.outputs[i].ty != this.outputs[i].y)) {
				this.outputs[i].tx = this.outputs[i].x + Math.floor((this.outputs[i].tx - this.outputs[i].x)/2)
				this.outputs[i].ty = this.outputs[i].y + Math.floor((this.outputs[i].ty - this.outputs[i].y)/2)
			}
			Screen('lineTo',this.outputs[i].x,this.outputs[i].y-5) // 5 == radius
			var dx = this.outputs[i].y > this.outputs[i].ty ? 2.5 :  this.outputs[i].y < this.outputs[i].ty ? - 2.5 : 0
			Screen('bezierCurveTo',
				this.outputs[i].x - dx + (this.outputs[i].tx - this.outputs[i].x)/2, this.outputs[i].y-5,
				this.outputs[i].x - dx + (this.outputs[i].tx - this.outputs[i].x)/2, this.outputs[i].ty-5,
				this.outputs[i].tx,this.outputs[i].ty-5)
				('arc',this.outputs[i].tx,this.outputs[i].ty, 5, -0.5 * Math.PI, 0.5 * Math.PI)
				('bezierCurveTo',
				this.outputs[i].x + dx + (this.outputs[i].tx - this.outputs[i].x)/2, this.outputs[i].ty+5,
				this.outputs[i].x + dx + (this.outputs[i].tx - this.outputs[i].x)/2, this.outputs[i].y+5,
				this.outputs[i].x,this.outputs[i].y+5)
		}
		Screen('lineTo',x+width,y+height)
			('lineTo',x,y+height)
		for (var i = inputs.length; i > 0; ) {
			--i;
			var dy = height / (inputs.length + 1)
			this.inputs[i].x = x
			this.inputs[i].y = y+i*dy+dy
			this.inputs[i].owner = this
			Screen('lineTo',x,y+i*dy +dy + 5)
				('arc',x,y+i*dy +dy ,5,0.5 * Math.PI, -0.5 * Math.PI,true)	
		}
		Screen('lineTo',x,y)
			('closePath')
			('fillStyle',this.color)
			('fill')
			('strokeStyle',Colors.Text.dark)
			('stroke')
			('restore')
			('save')
			('fillStyle',Colors.Text.dark)
			('fillText',this.label, x, y - 5)
			('fillStyle',Colors.Text.light)
		if (this.transform) Screen('fillText',"\u27f6", x + width/2 - 6, y + height/2 + 2)
		if (this.filter)  Screen('fillText',"\ud835\ude27", x + width/2 - 3, y + height/2 + 3)
		for (var i = inputs.length; i > 0; ) {
			--i;
			var dy = height / (inputs.length + 1)
			Screen('fillText',inputs[i].text,x+10,y+i*dy+dy+3)
		}
		for (var i = 0; i < outputs.length; ++i) {
			var dy = height / (outputs.length + 1)
			var offset = Screen('measureText',outputs[i].text)
			Screen('fillText',outputs[i].text, (x + width) - offset - 10,y+i*dy+dy+3)
		}
		Screen('restore')
		this.drawing = false
		return this
	case 'doubleclick':
		console.log('double click event')
		var x = message[1]
		var y = message[2]
		if (x < this.x || x > this.x + this.width || y < this.y || y > this.y + this.height) return;
		if (this.action) {
			console.log("performing special action")
			this.action()
		}
		return this
	case 'down':
		console.log('down')
		var x = message[1]
		var y = message[2]
		for (var i = 0; i < this.outputs.length; ++i) {
			var dx =  (x - this.outputs[i].tx)
			var dy =  (y - this.outputs[i].ty)
			if ( dx*dx + dy*dy < 25 ) {	// mouse within 5 of the center
				this.dragging = this.outputs[i]
				this.dragging.tx = x
				this.dragging.ty = y
				this.ack('move','up').nack('down')
				return this
			}
		}
		if (x < this.x || x > this.x + this.width || y < this.y || y > this.y + this.height) return;
		this.active = true;
		this.dx = x - this.x
		this.dy = y - this.y
		this.ack('move','up').nack('down')
		return this

	case 'up':
		if (this.dragging && this.dragging.target && ! this.dragging.target.target) {
			this.dragging.target = false
		} 
		this.dragging = false
		this.ack('down').nack('up','move')
		return this

	case 'move':
		var x = message[1]
		var y = message[2]
		if (this.dragging) {
			this.dragging.tx = x
			this.dragging.ty = y
			for (var i = 0; i < Frame.instances.length; ++i) {
				for (var j = 0; j < Frame.instances[i].inputs.length; ++j) {
					var tdx = (x - Frame.instances[i].inputs[j].x)
					var tdy = (y - Frame.instances[i].inputs[j].y)
					if (tdx*tdx + tdy*tdy < 225 ) { 
						if (this.dragging.target) {
							this.dragging.target.target = false
							break;
						}
						Screen('save')
							('strokeStyle',"red")
							('circle',Frame.instances[i].inputs[j].x,Frame.instances[i].inputs[j],15)
							('stroke')
							('restore')
						this.dragging.tx = Frame.instances[i].inputs[j].x
						this.dragging.ty = Frame.instances[i].inputs[j].y
						Frame.instances[i].inputs[j].target = this.dragging
						this.dragging.target = Frame.instances[i].inputs[j]
						this("up")
					}
				}
			}
			return this
		}
		this.x = x - this.dx
		this.y = y - this.dy
		var height = (Math.max(this.inputs.length,this.outputs.length) + 1) * 15
		var dy = height / (this.inputs.length + 1)
		for (var i = 0; i < this.inputs.length; ++i) {
			if (this.inputs[i].target) {
				this.inputs[i].target.tx = x - this.dx
				this.inputs[i].target.ty = y - this.dy + dy*i + dy
			}
		}
		return this
	case 'new':
		var color = message[1]
		var x = message[2]
		var y = message[3]
		var inputs = message[4]
		var outputs = message[5]
		var src = this.toString()
		var frame = Frame.clone()
		frame.color = color
		frame.x = x
		frame.y = y
		frame.inputs = []
		for (var i = 0; i < inputs.length; ++i) frame.inputs.push({ text: inputs[i], x: 0, y: 0, target: false})
		frame.outputs = []
		for (var i = 0; i < outputs.length; ++i) frame.outputs.push({ text: outputs[i], x: 0, y: 0, tx: 0, ty: 0, target: false})
		Frame.instances = Frame.instances ? Frame.instances : []
		Frame.instances.push(frame)
		frame.ack('down','doubleclick')
		return frame
	case 'label':
		this.label = message[1]
		return this	
	case 'filter':
		this.filter = message[1]
		return this
	case 'transform':
		this.transform = message[1]
		return this
	default:
		this.resend(Widget,message)
	}
	return this
}
// Components.js
//
// © 2013 David J. Goehrig
//

Producer = function(x,y,label,output) {
	return Frame("new",Colors.blue,x || 100,y || 100,[],[output || "out"])
		("label",label || "Producer")
		("show")
}

StartButton = function(x,y) {
	var button =  Producer(x,y,'StartButton','start')
	button.action = (function(button) { 
		return function() {
			console.log('sending message to ', button.outputs[0].target.owner)
			Message('start',button.outputs[0].target.owner)
		}
	})(button)
	return button;
}

StopButton = function(x,y) {
	var button = Producer(x,y,'StopButton','stop')
	button.action = (function(button) { 
		return function() {
			console.log('sending message to ', button.outputs[0].target.owner)
			Message('stop',button.outputs[0].target.owner)
		}
	})(button)
	return button
}

Pipe = function(x,y,label,input,output) {
	return Frame("new",Colors.green.light,x||100,y||100,[input||"in"],[output||"out"])
		("label",label || "Pipe")
		("show")
}

Consumer = function(x,y,label,input) {
	var consumer = Frame("new",Colors.red,x||100,y||100,[input||"in"],[])
		("label",label || "Consumer")
		("show")
	consumer.console = Console('new',x||100,y||100,20*40,20*25)('show')
	console.log("made console",consumer.console)
	consumer.console.action = function(_x,_y,o) { 
		console.log(o);
		for (var i = 0; i < o.ccTextTimestamps.length; ++i) 
			consumer.console('add',o.ccTextTimestamps[i][1].substr(0,80)); 

	}
	consumer.console.action.ack('debug')
	return consumer
}

Filter = function(x,y,label,input,output,fun) {
	return Frame("new",Colors.green.dark,x||100,y||100,[input||"in"],[output||"out"])
		("label",label || "Filter")
		("filter",fun ? fun.toString() : (function(m) { return m }).toString() )
		("show")
}

Transformer = function(x,y,label,input,output,fun) {
	return Frame("new",Colors.green.dark,x||100,y||100,[input||"in"],[output||"out"])
		("label",label || "Transformer")
		("transform", fun ? fun.toString() : (function(m) { return m }).toString())
		("show")
}

Twitter = function(x,y) {
	var twitter =  Frame("new",Colors.cyan,x||100,y||100,["start","stop"], ["tweets"])
		("label","Twitter")
		("show")	
	twitter.start = function(_m,o) {
		console.log(_m,o,twitter)
		if (o != twitter) return;
		console.log("Twitter got start", o)
	}
	twitter.stop = function(_m,o) {
		console.log(_m,o,twitter)
		if (o != twitter) return;
		console.log("Twitter got stop", o)
	}
	twitter.start.ack('start')
	twitter.stop.ack('stop')
}

Broadcast = function(x,y) {
	var broadcast = Frame("new",Colors.cyan,x||100,y||100,["start","stop"], ["cctext"])
		("label","Broadcast")
		("show")	
	broadcast.start =  function(_m,o) {
		console.log(_m,o,broadcast)
		if (o != broadcast) return;
		var id = Math.random()
		broadcast.url = 'ws://localhost:6719/wot.io/cctext/cctext.1202/pip.' + id + '/pip-out/pip'
		console.log("Broadcast got start message for ", broadcast.url);
		Message.attach(broadcast.url)
	}
	broadcast.stop = function(_m,o) {
		console.log(_m,o,broadcast)
		if (o != broadcast) return;
		console.log("Broadcast got stop message for ", broadcast.url);
		Message.detach(broadcast.url)
	}
	broadcast.start.ack('start')
	broadcast.stop.ack('stop')
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

Components = [ 
	StartButton,
	StopButton,
	Producer,
	Pipe,
	Consumer,
	Filter,
	Transformer,
	Broadcast,
	Twitter,
	RSS,
	MIMO,
	SIMO,
	MISO
]
// Button.js
//
// © 2013 David J. Goehrig <dave@dloh.org>
//

Button = function(method) {
	var self = this
	var message = arguments.list()	
	switch(method) {
	case 'new':
		var self = Button.clone()
		self.action = function() { console.log("Pressed") }
		self.label = message[1]
		self.x = message[2]
		self.y = message[3]	
		self.width = message[4]
		self.height = message[5]
		self.ack('down')
		return self
	case 'label':
		self.label = message[1]
		return self
	case 'action':
		self.action = message[1]
		return self
	case 'down':
		var x = message[1]
		var y = message[2]
		if (x < self.x || x > self.x + self.width || y < self.y || y > self.y + self.height) return self
		console.log('down')
		self.action()		
		return self
	case 'draw':
		Screen('save')
			('font','32px Arial')
		var dx = (self.width - Screen('measureText',self.label))/2
		var dy = (self.height - 32)/2 + 24 
		Screen('beginPath')
			('rect',self.x,self.y,self.width,self.height)
			('closePath')
			('stroke')
			('fillText',self.label, self.x + dx, self.y+dy)
		('restore')
		return self
	default:
		return self.resend(Widget,message)
	}
}
// Graph.js
//
// © 2013 David J. Goehrig
//

Graph = function(method) {
	var self = this
	var message = arguments.list()
	switch(method) {
	case 'new':
		var self = Graph.clone()
		self.color = message[1]	
		self.x = message[2]
		self.y = message[3]
		self.width = message[4]
		self.height = message[5]
		self.points = []
		return self
	case 'add':
		self.points.push(message[1])
		while (self.points.length > 20) self.points.shift()
		return self
	case 'data':
		self.points = message[1]
		return self
	case 'draw':
		if (self.points.length == 0) return self;
		var min = self.points[0]
		var max = self.points[0]
		Screen('save')
			('beginPath')
			('rect',self.x,self.y,self.width,self.height)
			('stroke')
			('closePath')
			('restore')
		for (var i = 0; i < self.points.length; ++i) {
			min = self.points[i] < min ? self.points[i] : min
			max = self.points[i] > max ? self.points[i] : max
		}
		var dx = self.width / (self.points.length -1)
		var dy = 1
		Screen('save')
			('strokeStyle',self.color)
			('fillStyle',self.color)
			('beginPath')
			('moveTo',self.x, self.y + self.height  - (self.points[0])*dy)
		for (var i = 1; i < self.points.length; ++i) 
			Screen('lineTo', self.x + dx*i, self.y + self.height - (self.points[i])*dy)
		Screen('stroke')('closePath')('restore')
		return self
	default:
		return self.resend(Widget,message)
	}
}
// Tree.js
//
// © 2013 David J. Goehrig
//

Tree = function(method) {
	var self = this
	var message = arguments.list()
	switch(method) {
	case 'new':
		var self = Tree.clone()
		self.x = message[1]
		self.y = message[2]
		self.width = message[3]
		self.height = message[4]
		self.label = ''
		self.data = {}	
		return self	
	case 'root':
		self.label = message[1]
		return self
	case 'data':
		self.data = message[1]
		return self
	case 'set':
		self.data[message[1]]  = message[2]
		return self
	case 'draw':
		Screen('save')
			('font','16px Arial')
			('fillText', self.label, self.x+20, self.y+20)
			var keys = self.data.keys() 
			for (var i = 0; i < keys.length; ++i)
				Screen('fillText', "+ " + keys[i], self.x+80, self.y + 30 * i + 50)
				('fillText', self.data[keys[i]], self.x+200, self.y + 30 * i + 50)
		Screen('restore')
		return self
	default:
		return self.resend(Widget,message)
	}
}
// Menu.js
//
// © 2013 David J. Goehrig <dave@dloh.org>
//

Menu = function(method) {
	var self = this
	var message = arguments.list()	
	switch(method) {
	case 'new':
		var self = Menu.clone()
		self.action = function() { console.log("Pressed") }
		self.labels = message[1]
		self.x = message[2]
		self.y = message[3]	
		self.width = 0
		self.height = 0
		self.ack('down')
		return self
	case 'labels':
		self.labels = message[1]
		return self
	case 'action':
		self.action = message[1]
		return self
	case 'down':
		var b = message[3]
		if (b != 2) return self;
		this.x = message[1]
		this.y = message[2]
		self.ack('up','move').nack('down')
		console.log('show menu')
		self('show')
		return self
	case 'up':
		var b = message[3]
		if (b != 2) return self;
		this.x = message[1]
		this.y = message[2]
		self.ack('down').nack('up','move')
		console.log('menu create', this.selected,  this.labels[this.selected])
		Components[this.selected](this.x,this.y)
		self('hide')
		return self
	case 'move':
		var x = message[1]
		var y = message[2]
		this.selected = Math.floor(Math.max(0,(Math.min(y - this.y, this.height) / 40))) % this.labels.length
		console.log("selected ", this.selected)
		return self
	case 'draw':
		Screen('save')
			('font','20px Arial')
		// calculate the maximum width of the menu items
		self.height = self.labels.length * 40
		for (var i = 0; i < self.labels.length; ++i) 
			self.width = Math.max(Screen('measureText',self.labels[i])+40,self.width)	
		
		for (var i = 0; i < self.labels.length; ++i) {
			var dx = (self.width - Screen('measureText',self.labels[i]))/2
			Screen('beginPath')
				('rect',self.x,self.y + i * 40,self.width,40)
				('closePath')
				('fillStyle', this.selected == i ? 'rgba(0,64,0,0.6)' : 'rgba(0,0,0,0.2)')
				('fill')
				('fillStyle', 'black')
				('fillText',self.labels[i], self.x + dx, self.y+ i * 40 + 25)
		}
		Screen('restore')
		return self
	default:
		return self.resend(Widget,message)
	}
}
