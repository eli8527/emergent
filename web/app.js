var osc = require('osc');
var express = require('express');
var WebSocket = require('ws');

// Create a Web Socket server to which OSC messages will be relayed.
var app = express();
var server = app.listen(8000);
var wss = new WebSocket.Server({
    server: server,
  });

// Serve static files.
app.use(express.static('public'));

wss.on('connection', (socket) => {
    console.log('Connected to browser!');

    // Bind to a WebSocket.
    var socketPort = new osc.WebSocketPort({ socket: socket });
    socketPort.open();

    // Bind to a UDP socket.
    var udpPort = new osc.UDPPort({ localPort: 3333 });
    udpPort.open();

    // Forward messages from Max to the browser.
    socketPort.on('message', (oscMsg) => {
        console.log('Bridge received OSC from browser: ', oscMsg);
        udpPort.send(oscMsg, 'localhost', 3334);
      });

    // Forward messages from the browser to Max.
    udpPort.on('message', (oscMsg) => {
        console.log('Bridge received OSC from Max: ', oscMsg);
        socketPort.send(oscMsg);
      });
  });
