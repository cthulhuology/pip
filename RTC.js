// RTC.js
//
// © 2013 David J. Goehrig
//


RTC = function(method) {
	var self = this
	var message = arguments.list()
	switch(method) {
	case 'new':
		self = RTC.clone()

		// setup peer
		self.peer = window.webkitRTCPeerConnection ? 
			new webkitRTCPeerConnection({ "iceServers": [{"url": "stun:stun.l.google.com:19302"}] }, { "optional": [{"DtlsSrtpKeyAgreement": true} , {RtpDataChannels: true }] }):
			new mozRTCPeerConnection({ "iceServers": [{"url": "stun:23.21.150.121"}] }, { "optional": [ { RtpDataChannels: true} ] });

		// 
		self.peer.onicecandidate = function (candidate) { console.log("ice candidate", candidate) }
		self.peer.oniceconnectionstatechange = function (state) { console.log("ice state change", state) }
		self.peer.onnegotiationneeded = function(wtf) { console.log("negotiation needed", wtf) }
		self.peer.onremovestream = function(stream) { console.log("remove stream", stream) }
		self.peer.onsignalingstatechange = function(state) { console.log("signaling state change", state) }
	
		// add a channel
		self.channel = self.peer.createDataChannel("pip", { reliable: false })
		self.channel.onopen = function() { console.log("channel opened", arguments.list()) }
		self.channel.onclose = function() { console.log("channel closed", arguments.list()) }
		self.channel.onmessage = function() { console.log("channel message", arguments.list()) }
		self.channel.onerror = function() { console.log("channel error", arguments.list()) }
		self.ack('peer')
		return self
	case 'offer':
		self.peer.createOffer( function(offer) { 
			console.log("createOffer", offer); 
			self.peer.setLocalDescription(offer) 
			Message("announce", offer.sdp, offer.type) 
			self.ack('answer')
		}, function(error) { console.error(error) },{})
		return self
	case 'peer':
		console.log("Got peer message", message)
		self.peer.setRemoteDescription(new mozRTCSessionDescription(message[1]),
			function(desc) {
				console.log("set remote description", desc)
				self.peer.createAnswer(function (answer) { 
					console.log("setting local description", answer)
					self.peer.setLocalDescription(answer)
					console.log("answered ", answer) 
					Message("answer", answer.sdp, answer.type)
				}, function(error) { console.error("createAnswer", error) }, {})
			}, function(error) { console.error("setRemoteDescription", error) })
		return self
	case 'answer':
		console.log("Got answer message", message)
		self.peer.setRemoteDescription(new mozRTCSessionDescription(message[1]), function(desc) {
			console.log("set remote", desc)
		}, function(error) { console.error(error) })
		return self
	default: 
		console.log("Unknown message", message)
	}
}

