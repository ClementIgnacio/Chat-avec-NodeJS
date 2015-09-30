var socket = io.connect('http://0.0.0.0:8080')
var fait = false;
var pseudonyme = null;

// Envoi du pseudo
$("#send_pseudo").click(function(){
  pseudonyme = $("#pseudo").val();
  // Si le pseudo est vide :
  if(pseudonyme == ''){
    $("#pseudo_wrong").text('Le pseudo ne doit pas être vide !').css('color', '#FF0000');
    $("#pseudo_wrong").addClass('invalid');
    return false;
  }

  $("#pseudo_wrong").text('').css('color', '#FF0000');
  socket.emit('nouveau_client', pseudonyme);
  $("#form_pseudo").css('display', 'none');
  $("#form_message").fadeIn(1000);
  $("#connect").fadeIn(1000);
  $("#zone_chat").fadeIn(2000);


  // Si le pseudo est déjà pris
  socket.on('pseudo_pris', function(message){
    $("#form_pseudo").css('display', 'block');
    $("#form_message").css('display', 'none');
    $("#connect").css('display', 'none');
    if(!fait){
      insererMessage('Erreur', message, 'highlight_off', 'red');
      fait = true;
    }
  });
    return false;
});

// Envoi d'un message
$("#send_message").click(function(){
  var message = $("#message").val();

  // Si le message est vide
   if(message == ''){
    $("#message_wrong").text('Le message ne doit pas être vide !').css('color', '#FF0000');
    $("#message_wrong").addClass('invalid');
    return false;
  }
  $("#message_wrong").text('').css('color', '#FF0000');
  socket.emit('nouveau_message', message);
  $("#message").not(':button, :submit, :reset, :hidden').val('').removeAttr('checked');
  return false;
});


// Si l'utilisateur quitte le chat
$("#quit").click(function(){
  socket.emit('quit', pseudonyme);
  $("#form_pseudo").css('display', 'none').fadeIn(1000);
  $("#form_message").fadeOut(1000);
  $("#connect").fadeOut(1000);

  return false;
})

// Affichage du pseudo de l'utilisateur qui se connecte
socket.on('nouveau_client', function(pseudo){
  insererMessage(pseudo, "Est entré dans le chat !", 'face', 'green');
})

// Affichage du message de l'utilisateur
socket.on('nouveau_message', function(data){
  insererMessage(data.pseudo, data.message, 'insert_emoticon', 'black');
})

// Affichage des utilisateurs connectés
socket.on('nb_connexion', function(user){
    $("#nbco").prepend('<tr><td>' + user +'</td></tr>');
})

// Affichage du message lors de déconnexion d'un utilisateur
socket.on('quit_success', function(pseudo){
  insererMessage(pseudo, 'Est parti du chat', 'location_off', 'pink');
});

// Fonction permettant d'afficher un message
 function insererMessage(pseudo, message, icon, color){
   $("#zone_chat").prepend('<i class="material-icons left '+ color +'-text">'+ icon +'</i><span class="title">' + pseudo + ': </span> ' + message +'</p>');
 }
