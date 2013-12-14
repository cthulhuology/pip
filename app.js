#!/usr/bin/env node

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


app.listen(6601)
