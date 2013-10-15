// Screen.js
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

Screen = Canvas.getContext('2d')
	
Screen.circle = function(x,y,r) {
	Screen.arc(x,y,r,0,Math.PI*2)
}

onFrame = (function(){
	return window.requestAnimationFrame	||
	window.webkitRequestAnimationFrame	||
	window.mozRequestAnimationFrame		||
	function( callback ){
		window.setTimeout(callback, 1000 / 60);
	};
})();

Screen.widgets = []		// an array of widgets on screen

Screen.render = function() {
	Screen.clearRect(0,0,window.innerWidth,window.innerHeight)
	for (var i = 0; i < Screen.widgets.length; ++i) Screen.widgets[i].send('draw')		// draw method
	onFrame(Screen.render)
}

window.onload = function() {
	onFrame(Screen.render)
}

Screen.show = function(widget) {
	if (Screen.widgets.indexOf(widget) < 0) Screen.widgets.push(widget)	// only add to the display list if not already there	
}

Screen.hide = function(widget) {
	if (screen.widgets.indexOf(widget) < 0 ) return;		// don't hide invisible things :)
	Screen.widgets.splice(Screen.widgets.indexOf(widget),1)
}
