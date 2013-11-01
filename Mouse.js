// Mouse.js
// 
// © 2012,2013 David J Goehrig
// 
// Manages mouse events, requires Hub.js & Screen.js beloaded first
// 

Mouse = function(e) {
	switch(e.type) {
		case 'mousedown':
			Message('down', e.clientX + Screen.x, e.clientY + Screen.y, e.button)
			break
		case 'mousemove': 
			Message('move', e.clientX + Screen.x, e.clientY + Screen.y)
			break
		case 'mouseup':
			Message('up', e.clientX + Screen.x, e.clientY + Screen.y, e.button)
			break
		case 'wheel':
			Message('scroll', e.deltaX, e.deltaY)
			break
		case 'mousewheel':
			Message('scroll', -e.wheelDeltaX, -e.wheelDeltaY)
			break
		default:
			// ignore this type of event
	}
}

Canvas.addEventListener('mousedown',Mouse,false)
Canvas.addEventListener('mousemove',Mouse,false)
Canvas.addEventListener('mouseup',Mouse,false)
Canvas.addEventListener('wheel',Mouse,false)
Canvas.addEventListener('mousewheel',Mouse,false)
