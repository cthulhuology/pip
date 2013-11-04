// Persona.js
//
// © 2013 David J. Goehrig
//
// Mozilla Persona Login code for authenticated websockets
//

// this is a bad idea but it works!

Persona = function(method) {
	var self = this
	var message = arguments.list()
	switch(method) {
	case 'new':
		self = Persona.clone()
		self.user = ''
		document.writeln('<script src="https://login.persona.org/include.js"></script>')
		self.ack('signin')
		return self
	case 'signin':
		navigator.id.watch({
			loggedInUser: self.user,
			onlogin: function(assertion) {
				self.url = 'ws://' + document.location.hostname + ':6602/' + assertion
				self.ack('auth').nack('signin')
				Message.attach(self.url,'*')
			},
			onlogout: function() {
				self.user = ''
				self.nack('signout').ack('signin')
				Message.detach(self.url)
			}
		})
		navigator.id.request()
		return self
	case 'auth':
		console.log("Got auth message", message)
		self.user = message[1]	// email	
		self.ack('signout').nack('auth')
		return self
	case 'signout':
		console.log('signing out')
		navigator.id.logout()
		return this
	default:
		console.log("unknown message", message)
	}
}

persona = Persona('new')

