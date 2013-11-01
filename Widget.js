// Widget.js
//
// © 2012, 2013 David J. Goehrig <dave@dloh.org>
//

Widget = function(method) {
	var message = arguments.list()
	switch(method) {
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
