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
