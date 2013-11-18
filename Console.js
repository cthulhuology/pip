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
		return self	
	case 'draw':
		Screen('save')
			('font', '16px Lucida Console')
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


