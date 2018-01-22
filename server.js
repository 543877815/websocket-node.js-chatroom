const WebSocket = require('ws');

// const wss = new WebSocket.Server({ port: 8181 });

var WebSocketServer = require('ws').Server,
  fs = require('fs');


var cfg = {
        ssl: true,
        port: 8181,
        ssl_key: '/etc/nginx/cert/214181433450730.key',
        ssl_cert: '/etc/nginx/cert/214181433450730.pem'
    };

var httpServ = ( cfg.ssl ) ? require('https') : require('http');

var app      = null;

var processRequest = function( req, res ) {

    res.writeHead(200);
    res.end("All glory to WebSockets!\n");
};

if ( cfg.ssl ) {

    app = httpServ.createServer({

        // providing server with  SSL key/cert
        key: fs.readFileSync( cfg.ssl_key ),
        cert: fs.readFileSync( cfg.ssl_cert )

    }, processRequest ).listen( cfg.port );

} else {

    app = httpServ.createServer( processRequest ).listen( cfg.port );
}

var wss = new WebSocketServer( { server: app } );

// Broadcast to all.
wss.broadcast = function broadcast(data) {
  wss.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  });
};

var users = [];
var usercount = 0;
var user_enter = false;
wss.on('connection', function connection(ws) {
  var username = null;
  usercount++;
  var json ={
    message:usercount,
    type:"usercount"
  }
  ws.send(JSON.stringify(json));
  ws.on('message', function incoming(data) {
    console.log(data);
    var message = JSON.parse(data);
    switch (message.type) {
      case "username":
      username = message.message;
      if(users.indexOf(username)=="-1"){
        users.push(username);
        var json = {
          username:username,
          type:"user-enter"
        }
        wss.broadcast(JSON.stringify(json));
        var json = {
          message:usercount,
          type:"online-usercount"
        }
        wss.broadcast(JSON.stringify(json));
        var json = {
          username:username,
          type:"yourname"
        }     
        ws.send(JSON.stringify(json));
      }else {
        var json = {
          message:"repeat",
          type:"repeat-alert"
        }
        ws.send(JSON.stringify(json));
      }
      break;
      case "info":
      var json = {
        message:message.message,
        type:"info",
        username: username
      }
      wss.broadcast(JSON.stringify(json));
      break;
      default:
        // statements_def
        break;
      }
    // wss.clients.forEach(function each(client) {
    //   if (/*client !== ws && */client.readyState === WebSocket.OPEN) {
    //     client.send(data);
    //   }
    // });
  });
  ws.on("close" , function outgoing(data){
    usercount--;
    var json = {
      message:usercount,
      type:"online-usercount"
    }
    if(username!==null){
      for(var i = 0;i<users.length;i++){
        if(users[i]==username){
          users.splice(i, 1);
        }
      }
      wss.broadcast(JSON.stringify(json));
      var json = {
        username:username,
        type:"user-leave"
      }
      wss.broadcast(JSON.stringify(json));
    }
    
  })
});