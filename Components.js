// Components.js
//
// © 2013 David J. Goehrig
//

<<<<<<< HEAD

// session id

=======
>>>>>>> c9eb848e68893d9e807ee6b40fa21e3682a23725
Producer = function(x,y,label,output) {
	return Frame("new",Colors.blue,x || 100,y || 100,[],[output || "out"])
		("label",label || "Producer")
		("show")
}

<<<<<<< HEAD
StartButton = function(x,y) {
	var button =  Producer(x,y,'StartButton','start')
	button.action = (function(button) { 
		return function() {
			console.log('sending message to ', button.outputs[0].target.owner)
			Message('start',button.outputs[0].target.owner)
		}
	})(button)
	return button;
}

StopButton = function(x,y) {
	var button = Producer(x,y,'StopButton','stop')
	button.action = (function(button) { 
		return function() {
			console.log('sending message to ', button.outputs[0].target.owner)
			Message('stop',button.outputs[0].target.owner)
		}
	})(button)
	return button
}

=======
>>>>>>> c9eb848e68893d9e807ee6b40fa21e3682a23725
Pipe = function(x,y,label,input,output) {
	return Frame("new",Colors.green.light,x||100,y||100,[input||"in"],[output||"out"])
		("label",label || "Pipe")
		("show")
}

Consumer = function(x,y,label,input) {
<<<<<<< HEAD
	var consumer = Frame("new",Colors.red,x||100,y||100,[input||"in"],[])
		("label",label || "Consumer")
		("show")
	consumer.console = Console('new',x||100,y||100,20*40,20*25)('show')
	console.log("made console",consumer.console)
	consumer.console.action = function(m,x,o) { 
		console.log("Console action", arguments.list());
		if (m == 'twitter') {
			consumer.console('add', x.text.substr(0,80))
		}
		if (m == 'debug') {
			for (var i = 0; i < o.ccTextTimestamps.length; ++i) 
				consumer.console('add',o.ccTextTimestamps[i][1].substr(0,80)); 
		}

	}
	consumer.attach = function(_m,o,message) {
		if (o != consumer) return;
		console.log('Console listening for ', message)
		consumer.console.action.ack(message)
	}
	consumer.attach.ack('attach')
	return consumer
=======
	return Frame("new",Colors.red,x||100,y||100,[input||"in"],[])
		("label",label || "Consumer")
		("show")
>>>>>>> c9eb848e68893d9e807ee6b40fa21e3682a23725
}

Filter = function(x,y,label,input,output,fun) {
	return Frame("new",Colors.green.dark,x||100,y||100,[input||"in"],[output||"out"])
		("label",label || "Filter")
<<<<<<< HEAD
		("filter",fun ? fun.toString() : (function(m) { return m }).toString() )
=======
		("filter",fun.toString())
>>>>>>> c9eb848e68893d9e807ee6b40fa21e3682a23725
		("show")
}

Transformer = function(x,y,label,input,output,fun) {
	return Frame("new",Colors.green.dark,x||100,y||100,[input||"in"],[output||"out"])
		("label",label || "Transformer")
<<<<<<< HEAD
		("transform", fun ? fun.toString() : (function(m) { return m }).toString())
=======
		("transform",fun.toString())
>>>>>>> c9eb848e68893d9e807ee6b40fa21e3682a23725
		("show")
}

Twitter = function(x,y) {
<<<<<<< HEAD
	var twitter =  Frame("new",Colors.cyan,x||100,y||100,["start","stop"], ["tweets"])
		("label","Twitter")
		("show")	
	twitter.start = function(_m,o) {
		console.log(_m,o,twitter)
		if (o != twitter) return;
		var id = Math.random()
		twitter.url = 'ws://bus03.wot.io:9001/wot.io/twitter-out/%23/pip.' + id + '/twitter-in/pip'
		console.log("Twitter got start", o)
		if (twitter.outputs[0].target.owner) {
			Message('attach', twitter.outputs[0].target.owner, 'twitter')
		}
		Message.attach(twitter.url)
		Message('connect','statuses/sample')
	}
	twitter.stop = function(_m,o) {
		console.log(_m,o,twitter)
		if (o != twitter) return;
		console.log("Twitter got stop", o)
		Message.detach(twitter.url)
	}
	twitter.start.ack('start')
	twitter.stop.ack('stop')
}

Broadcast = function(x,y) {
	var broadcast = Frame("new",Colors.cyan,x||100,y||100,["start","stop"], ["cctext"])
		("label","Broadcast")
		("show")	
	broadcast.start =  function(_m,o) {
		console.log(_m,o,broadcast)
		if (o != broadcast) return;
		var id = Math.random()
		broadcast.url = 'ws://bus03.wot.io:9001/wot.io/cctext/%23/pip.' + id + '/pip-out/pip'
		if (broadcast.outputs[0].target.owner) {
			Message('attach', broadcast.outputs[0].target.owner, 'debug')
		}
		console.log("Broadcast got start message for ", broadcast.url);
		Message.attach(broadcast.url)
	}
	broadcast.stop = function(_m,o) {
		console.log(_m,o,broadcast)
		if (o != broadcast) return;
		console.log("Broadcast got stop message for ", broadcast.url);
		Message.detach(broadcast.url)
	}
	broadcast.start.ack('start')
	broadcast.stop.ack('stop')
}


=======
	return Frame("new",Colors.cyan,x||100,y||100,["start","stop"], ["tweets"])
		("label","Twitter")
		("show")	
}

>>>>>>> c9eb848e68893d9e807ee6b40fa21e3682a23725
RSS = function(x,y) {
	return Frame("new",Colors.cyan,x||100,y||100,["start","stop"], ["rss"])
		("label","RSS")
		("show")	
}

MIMO = function(x,y,m,n,color) {
	var _in = []
	var _out = []
	for (var i = 0; i < m; ++i) _in.push("in")
	for (var i = 0; i < n; ++i) _out.push("out")
	return Frame("new",color||Colors.brown,x||100,y||100,_in,_out)
		("label","MIMO")
		("show")	
}

SIMO = function(x,y,n) {
	return MIMO(x||100,y||100,1,n||0, Colors.yellow)("label","SIMO")
}

MISO = function(x,y,m) {
	return MIMO(x||100,y||100,m||0,1, Colors.orange)("label","MISO")
}

<<<<<<< HEAD
Components = [ 
	StartButton,
	StopButton,
	Broadcast,
	Twitter,
	Consumer,
	Producer,
	Pipe,
	Filter,
	Transformer,
	RSS,
	MIMO,
	SIMO,
	MISO
]
=======
>>>>>>> c9eb848e68893d9e807ee6b40fa21e3682a23725
