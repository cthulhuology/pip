
server = new WebSocket.Server({ port: 6602 })
console.log("got server " + server)

var sockets = []

server.on('connection', function(socket) {
	console.log("session " + socket.upgradeReq.url + " started")
	var payload = ''
	var assertion = 'assertion=' + socket.upgradeReq.url.split("/")[1] + '&audience=' + 'http://localhost:6601/'
  	var request = https.request({ 
		hostname: 'verifier.login.persona.org',
		port: 443,
		path: '/verify',
		method: 'POST',
		headers: { 
			'Content-Length' : assertion.length,
			'Content-Type' : 'application/x-www-form-urlencoded'
		}
	}, function(response) {
		if (response.statusCode != 200) {
			socket.close()
			console.log("Bad response for login " + response.statusCode)
			return
		}
		response.on('data', function(data) {
			payload += data
		})
		response.on('end', function() {
			var msg = JSON.parse(payload)
			socket.send(JSON.stringify(["auth", msg.email, msg.expires, msg.issuer, msg.status ]))
			sockets.push(socket)
		})

	})
	request.end(assertion)
	
	request.on('error', function(error) {
		console.log("verification failure " + error)
		socket.close()
	})
	
	socket.on('message', function(message) {
		console.log("got message " + message)
		try {
			var msg = JSON.parse(message)
			if (msg[0] == "announce") {
				console.log("peer announcement")
				for (var i = 0; i < sockets.length; ++i) {
					if ( sockets[i] != socket) {
						console.log("sending", ["peer", msg[1],msg[2]])
						 sockets[i].send(JSON.stringify(["peer", msg[1],msg[2]]))
					}
				}
			}
		} catch(e) {
			console.log("Message error " + e + " on message " + message)
		}
	})
	socket.on('close', function() {
		console.log("session " + socket.upgradeReq.url + " closed")
		if (sockets.indexOf(socket) >= 0) sockets.slice(sockets.indexOf(socket),1)
	})
})


