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
		}
	onFrame(Screen.render)
}

Screen.ack('scroll')

window.onload = function() {
	onFrame(Screen.render)
}
