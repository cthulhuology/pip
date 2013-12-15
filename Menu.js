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
