// Frame.js
// 
// Renders an I/O frame for representing a process
//

Frame = function(method) {
	var message = arguments.list()
	switch(method) {
	case 'draw':
		if (this.drawing) return;
		this.drawing = true
		var x = this.x
		var y = this.y
		var inputs = this.inputs
		var outputs = this.outputs
		Screen.save()	
		var height = (Math.max(inputs.length,outputs.length) + 1) * 15
		var width = 0	
		for (var i = 0; i < inputs.length; ++i) width = Math.max(width, Screen.measureText(inputs[i]).width * 2)
		for (var i = 0; i < outputs.length; ++i) width = Math.max(width, Screen.measureText(outputs[i]).width * 2)
		width += 40 
		this.width = width
		this.height = height
		Screen.beginPath()
		Screen.rect(x,y,width,height)	
		Screen.stroke()
		Screen.closePath()
		for (var i = 0; i < inputs.length; ++i) {
			var dy = height / (inputs.length + 1)
			Screen.fillStyle = 'white'
			Screen.globalCompositeOperation = 'destination-out'
			Screen.beginPath()
			Screen.circle(x,y+i*dy + dy, 4)
			Screen.closePath()
			Screen.fill()
			Screen.globalCompositeOperation = 'source-over'
			Screen.beginPath()
			Screen.arc(x,y+i*dy + dy,5,-0.5 * Math.PI, 0.5 * Math.PI)	
			Screen.stroke()
			Screen.closePath()
			Screen.fillStyle = 'black'
			Screen.fillText(inputs[i],x+10,y+i*dy+dy+3)
		}
		for (var i = 0; i < outputs.length; ++i) {
			var dy = height / (outputs.length + 1)
			Screen.fillStyle = 'white'
			Screen.globalCompositeOperation = 'destination-out'
			Screen.beginPath()
			Screen.circle(x+width,y+i*dy + dy, 4)
			Screen.fill()
			Screen.globalCompositeOperation = 'source-over'
			Screen.closePath()
			Screen.beginPath()
			Screen.arc(x+width,y +i*dy + dy,5,-0.5 * Math.PI, 0.5 * Math.PI)	
			Screen.stroke()
			Screen.closePath()
			Screen.fillStyle = 'black'
			var offset = Screen.measureText(outputs[i]).width
			Screen.fillText(outputs[i], (x + width) - offset - 10,y+i*dy+dy+3)
		}
		Screen.restore()
		this.drawing = false
		return this

	case 'down':
		var x = message[1]
		var y = message[2]
		if (x < this.x || x > this.x + this.width || y < this.y || y > this.y + this.height) return;
		this.active = true;
		this.dx = x - this.x
		this.dy = y - this.y
		Hub('subscribe','move',this)	// watch for move events
		Hub('subscribe','up',this)	//
		Hub('unsubscribe','down',this)
		return this

	case 'up':
		Hub('subscribe','down',this)	// watch for down events
		Hub('unsubscribe','up',this)	
		Hub('unsubscribe','move',this)
		return this

	case 'move':
		var x = message[1]
		var y = message[2]
		this.x = x - this.dx
		this.y = y - this.dy
		return this

	case 'show':
		Screen.show(this)
		Hub('subscribe','down',this)
		return this
	
	case 'hide':
		Screen.hide(this)
		return this

	case 'new':
		var name = message[1]
		var x = message[2]
		var y = message[3]
		var inputs = message[4]
		var outputs = message[5]
		eval(name.toString() + ' = ' + this.toString())
		window[name].x = x
		window[name].y = y
		window[name].inputs = inputs
		window[name].outputs = outputs
		return window[name]
	
	default:
		// ignore the message
	}
}


Frame.x = 100
Frame.y = 100
Frame.inputs = ['x','y','z' ]
Frame.outputs = [ 'transform' ]
Frame.send('show')

Frame.send('new','Frame2',300,100,['foo'],['bar']).send('show')

