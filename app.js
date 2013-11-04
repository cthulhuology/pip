https = require('https')
WebSocket = require('ws')
express = require('express')

app = express()
app.get("/", function (req,res) {
	res.sendfile(__dirname + "/pip.html")
})
app.get("/pip", function(req,res) {
	res.sendfile(__dirname + "/pip.js")
})
app.use(express.static(__dirname + "/"))

server = new WebSocket.Server({ port: 6602 })
console.log("got server " + server)
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
		} catch(e) {
			console.log("Message error " + e + " on message " + message)
		}
	})
	socket.on('close', function() {
		console.log("session " + socket.upgradeReq.url + " closed")
	})
})


app.listen(6601)
