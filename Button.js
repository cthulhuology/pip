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
