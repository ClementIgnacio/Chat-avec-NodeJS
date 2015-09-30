var app = require('express')(),
	server = require('http').createServer(app),
	bs = require("browser-sync").create();

// Synchronisation avec Browser-sync
bs.init({
    port: 8080,
    files: ["views/*.html", "webroot/js/*.js", "server*.js"],
    proxy: "0.0.0.0:8080",
    logLevel: "info",
    logFileChanges: true

});

// Définition des routes
app.get('/', function(req, res){
	res.sendFile(__dirname + '/views/index.html');
});

app.get('/webroot/js/main.js', function(req, res){
	res.sendFile(__dirname + '/webroot/js/main.js');
});


var io = require('socket.io')(server);
var users = Array();
var pseudonyme;
var k = 0;

// Définitions des sockets
io.sockets.on('connection', function(socket){

	// Lorsque l'utilisateur quitte le chat
	socket.on('quit', function(pseudo){
		var trouve = false;
		var k = 0;
		while (k < users.length && trouve == false) {
       		if (users[k] == pseudo)
       			trouve = true;
       		k++;
   		}
		users.splice(k-1, 1);
       	console.log(users);
       	io.sockets.emit('quit_success', pseudo);


	});

	// Lorsqu'un nouveau client se connecte
	socket.on('nouveau_client', function(pseudo){
		var trouve = false;
		var i = 0;
		while (i < users.length && trouve == false) {
       		if (users[i] == pseudo){
       			trouve = true;
						// Le pseudo existe déjà, on informe l'utilisateur
       			socket.emit('pseudo_pris', 'Le pseudo ' + pseudo + ' est déjà utilisé. Merci d\'en choisir un autre.');
       		}
       		i++;
   		}
			// Si le pseudo n'existe pas :
   		if(!trouve){
			socket.pseudo = pseudo;
			users.push(pseudo);
			console.log(users);
			io.sockets.emit('nb_connexion', pseudo);
			io.sockets.emit('nouveau_client', pseudo);
   		}
	});

	// Envoi d'un nouveau message
	socket.on('nouveau_message', function(message){
		io.sockets.emit('nouveau_message', {pseudo : socket.pseudo, message : message});
	});

	// Envoi k sockets à chaque utilisateur connecté :
	function afficherUsers(){
		for (var k in users)
		io.sockets.emit('nb_connexion', users[k]);
	}

});




server.listen(8080, '0.0.0.0');
