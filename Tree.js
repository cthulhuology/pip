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
