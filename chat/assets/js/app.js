(function($){
  var $error = $('#error'),
    $success =  $('#success'),
    $form = $('#register');

  $error.hide();
  $success.hide();

  $form.on('submit', function(e){
    e.preventDefault();
    $error.hide();
    $success.hide();

    var login = $form.find('#name').val(),
      password = $form.find('#password').val(),
      confirm = $form.find('#confirm').val();

    if(!login){
      $error.text("Enter user login").slideDown('fast');
    }else if(!password || password !== confirm){
      $error.text("Pasword don't match").slideDown('fast');
    }else{
      $.post('/user', {
        username: login,
        password: password
      }).success(function(data){
        $success.text(data.username+' successfuly created. You may login.').slideDown('fast');
      }).error(function(data){
        $error.text('Error creating user').slideDown('fast');
      });
    }
  });
})(jQuery);


// Chat
(function($){
  var $form = $('#messages-form'),
    $msg = $('#message'),
    $list = $('.messages-list'),
    $wrapper = $('.message-wrapper');

  io.socket.request('/messages',{'forceNew': true });
  io.socket.request('/user',{'forceNew': true });

  io.socket.on('messages', function(msg){
    if(msg.data && msg.data.body){
      displayMessage(msg.data.body, msg.data.username, msg.data.createdAt);
      scrollContainer();
    }else{
      console.log(msg);
    }
  });

  io.socket.on('user', function(user){
    if(localStorage['ChatUserId'] == user.id && !user.data.loggedIn){
      location.reload();
    }
    if(user.data.loggedIn){
      displayUser(user.data.id, user.data.username);
    }else{
      $('.js-user-'+user.data.id).remove();
    }
  });

  io.socket.on('session-expired', function(){
    location.reload();
  });

  io.socket.get('/messages?limit=20&sort=createdAt desc', function(msg){
    msg.reverse();
    for(var i=0; i < msg.length; i++){
      displayMessage(msg[i].body, msg[i].username, msg[i].createdAt);
    }
    scrollContainer();
  });

  io.socket.get('/user', function(user){
    _.each(user, function(item){
      if(item.loggedIn){
        displayUser(item.id, item.username);
      }
    });
  });


  $form.on('submit', function(e){
    e.preventDefault();
    var message = $msg.val();

    if(message){
      $msg.val('');
      io.socket.post('/messages', {body: message}, function(msg){
        displayMessage(msg.body, msg.username, msg.createdAt);
        scrollContainer();
      });
    }
  });

  $('.login').on('submit', function(e){
    e.preventDefault();
    var username = $('#username').val();
    var password = $('#password').val();

    $.post( "/login", {
      username: username,
      password: password
    }, function(resp) {
      localStorage['ChatUserId'] = resp.id;
      location.reload();
    });
  });

  $('.js-logout').click(function(e){
    e.preventDefault();
    $.post( "/logout", function(resp) {
      location.reload();
    });
  });

  var scrollContainer = function(){
    $wrapper.scrollTop($list.height());
  };

  var displayMessage = function(text, user, time){
    $list.append('<li class="item">'+
      '<span class="date">'+moment(time).format('HH:mm:ss')+'</span>'+
      '<b class="user">['+ user +']</b> '+
      _.escape(text)+
      '</li>'
    );
  };

  var displayUser = function(id, user){
    $('.users-list').append('<li class="js-user-'+id+'">'+ _.escape(user) +'</li>');
  };
})(jQuery);
