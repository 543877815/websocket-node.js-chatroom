# websocket-node.js-chatroom
this is for http;
const wss = new WebSocket.Server({ port: 8181 });

this is for https;
var WebSocketServer = require('ws').Server,
  fs = require('fs');


var cfg = {
        ssl: true,
        port: 8181,
        ssl_key: '/etc/nginx/cert/your.key',
        ssl_cert: '/etc/nginx/cert/your.pem'
    };

var httpServ = ( cfg.ssl ) ? require('https') : require('http');

var app      = null;

var processRequest = function( req, res ) 
{
    res.writeHead(200);
    res.end("All glory to WebSockets!\n");
};

if ( cfg.ssl ) {
    app = httpServ.createServer(
    {
        // providing server with  SSL key/cert
        key: fs.readFileSync( cfg.ssl_key ),
        cert: fs.readFileSync( cfg.ssl_cert )

    }, processRequest ).listen( cfg.port );

} else {
    app = httpServ.createServer( processRequest ).listen( cfg.port );
}

var wss = new WebSocketServer( { server: app } );
