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
