
// 
// © 2012,2013 David J. Goehrig <dave@dloh.org>
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
		var height = (Math.max(inputs.length,outputs.length) + 1) * 15
		var width = 0	
		for (var i = 0; i < inputs.length; ++i) width = Math.max(width, Screen.measureText(inputs[i].text).width * 2)
		for (var i = 0; i < outputs.length; ++i) width = Math.max(width, Screen.measureText(outputs[i].text).width * 2)
		width += 40 
		this.width = width
		this.height = height
		Screen.save()	
		Screen.beginPath()
		Screen.moveTo(x,y)
		Screen.lineTo(x+width,y)
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
			Screen.lineTo(this.outputs[i].x,this.outputs[i].y-5) // 5 == radius
			Screen.bezierCurveTo(
				this.outputs[i].x + (this.outputs[i].tx - this.outputs[i].x)/2, this.outputs[i].y-5,
				this.outputs[i].x + (this.outputs[i].tx - this.outputs[i].x)/2, this.outputs[i].ty-5,
				this.outputs[i].tx,this.outputs[i].ty-5
			)
			Screen.arc(this.outputs[i].tx,this.outputs[i].ty, 5, -0.5 * Math.PI, 0.5 * Math.PI)
			Screen.bezierCurveTo(
				this.outputs[i].x + (this.outputs[i].tx - this.outputs[i].x)/2, this.outputs[i].ty+5,
				this.outputs[i].x + (this.outputs[i].tx - this.outputs[i].x)/2, this.outputs[i].y+5,
				this.outputs[i].x,this.outputs[i].y+5
			)
			var offset = Screen.measureText(outputs[i].text).width
			Screen.fillText(outputs[i].text, (x + width) - offset - 10,y+i*dy+dy+3)
		}
		Screen.lineTo(x+width,y+height)
		Screen.lineTo(x,y+height)
		for (var i = inputs.length; i > 0; ) {
			--i;
			var dy = height / (inputs.length + 1)
			Screen.lineTo(x,y+i*dy +dy + 5)
			Screen.arc(x,y+i*dy +dy ,5,0.5 * Math.PI, -0.5 * Math.PI,true)	
			Screen.fillText(inputs[i].text,x+10,y+i*dy+dy+3)
		}
		Screen.lineTo(x,y)
		Screen.strokeStyle = "black"
		Screen.closePath()
		Screen.stroke()
		Screen.fillStyle = this.color;
		Screen.fill()
		Screen.restore()
		this.drawing = false
		return this

	case 'down':
		var x = message[1]
		var y = message[2]
		for (var i = 0; i < this.outputs.length; ++i) {
			var dx =  (x - this.outputs[i].tx)
			var dy =  (y - this.outputs[i].ty)
			if ( dx*dx + dy*dy < 16 ) {	// mouse within 6 of the center
				this.dragging = this.outputs[i]
				this.dragging.tx = x
				this.dragging.ty = y
				Hub('subscribe','move',this)	// watch for move events
				Hub('subscribe','up',this)	//
				Hub('unsubscribe','down',this)
				return this
			}
		}
		if (x < this.x || x > this.x + this.width || y < this.y || y > this.y + this.height) return;
		this.active = true;
		this.dx = x - this.x
		this.dy = y - this.y
		Hub('subscribe','move',this)	// watch for move events
		Hub('subscribe','up',this)	//
		Hub('unsubscribe','down',this)
		return this

	case 'up':
		this.dragging = false
		Hub('subscribe','down',this)	// watch for down events
		Hub('unsubscribe','up',this)	
		Hub('unsubscribe','move',this)
		return this

	case 'move':
		var x = message[1]
		var y = message[2]
		if (this.dragging) {
			this.dragging.tx = x
			this.dragging.ty = y
			return this
		}
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
		var color = message[1]
		var x = message[2]
		var y = message[3]
		var inputs = message[4]
		var outputs = message[5]
		var src = this.toString()
		var frame = Function.prototype.constructor.apply(Function.prototype,[ "method", src.substr(20, src.length - 21)])
		frame.color = color
		frame.x = x
		frame.y = y
		frame.inputs = []
		for (var i = 0; i < inputs.length; ++i) frame.inputs.push({ text: inputs[i], x: 0, y: 0, tx: 0, ty: 0})
		frame.outputs = []
		for (var i = 0; i < outputs.length; ++i) frame.outputs.push({ text: outputs[i], x: 0, y: 0, tx: 0, ty: 0})
		return frame
	
	default:
		console.log(this  + "received unknown message " + message)
		// ignore the message
	}
	return this
}

Frame1 = Frame.send('new','rgba(0,255,0,0.3)',100,100,['x','y','z'],['transform']).send('show') 
Frame2 = Frame.send('new','rgba(255,0,0,0.4)',300,100,['foo'],['bar']).send('show')

