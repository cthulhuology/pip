// Mouse.js
// 
// © 2012,2013 David J Goehrig
// 
// Manages mouse events, requires Hub.js & Screen.js beloaded first
// 

Mouse = function(e) {
	e.preventDefault()
	e.cancelBubble = true;
	switch(e.type) {
		case 'contextmenu':
			console.log(e)
		case 'mousedown':
			Message('down', e.clientX + Screen.x, e.clientY + Screen.y, e.button)
			var now = new Date();
			if (now - Mouse.last < 300) {
				console.log("doubleclick event detected")	
				Message('doubleclick', e.clientX + Screen.x, e.clientY + Screen.y, e.button)
			}
			Mouse.last = now
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
	return true;
}

window.addEventListener('mousedown',Mouse,true)
window.addEventListener('mousemove',Mouse,true)
window.addEventListener('mouseup',Mouse,true)
window.addEventListener('wheel',Mouse,true)
window.addEventListener('mousewheel',Mouse,true)
window.addEventListener('contextmenu',Mouse,true)
