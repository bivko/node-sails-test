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
      confirm = $form.find('#confirm').val(),
      email = $form.find('#email').val();

    if(!email){
      $error.text("Enter user Email").slideDown('fast');
    }else if(!login){
      $error.text("Enter user login").slideDown('fast');
    }else if(!password || password !== confirm){
      $error.text("Pasword don't match").slideDown('fast');
    }else{
      $.post('/user', {
        username: login,
        email: email,
        password: password
      }).success(function(data){
        $success.text(data.username+' successfuly created. You may login.').slideDown('fast');
      }).error(function(data){
        if(data.responseJSON.invalidAttributes){
          $error.html('');
          _.each(data.responseJSON.invalidAttributes, function(item){
            _.each(item, function(error){
              $error.append('<p>'+ error.message +'</p>').slideDown('fast');
            });
          });
        }else{
          $error.text('Error creating user').slideDown('fast');
        }
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
  io.socket.request('/chat',{'forceNew': true });

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

  io.socket.on('chat', function(chat){
    appendChatName(chat.data.name, chat.data.url);
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

  io.socket.get('/chat', function(chat){
    if(chat.length){
      var $addWrapper = $('.js-add-chat-wrapper');
      if($addWrapper.length){
        _.each(chat, function(item){
          $addWrapper.before('<li><a href="/chats/'+ item.url +'">'+ item.name +'</a></li>');
        });
      }else{
        var $wrapper = $('.navbar-nav');
        _.each(chat, function(item){
          $wrapper.append('<li><a href="/chats/'+ item.url +'">'+ item.name +'</a></li>');
        });
      }
    }
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
    var email = $('#email').val();
    var password = $('#password').val();

    if(email && password){
      $.post( "/login", {
        email: email,
        password: password
      }, function(resp) {
        localStorage['ChatUserId'] = resp.id;
        location.href = location.origin + "/";
      });
    }
  });

  $('.js-logout').click(function(e){
    e.preventDefault();
    $.post( "/logout", function() {
      location.href = location.origin + "/";
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

  //Add chat
  $('.js-add-chat').click(function(e){
    e.preventDefault();

    var chatName = prompt('please enter new chat name').replace(/[^A-Za-zА-Яа-я '"]/g, ""),
      url = chatName.replace(/[^A-Za-z]/g, "");

    if(chatName){
      io.socket.post('/chat/addNewChat', {
        name: chatName,
        url: url
      }, function(chat){
        appendChatName(chat.name, chat.url);
      });
    }
  });

  var appendChatName = function(name, url){
    var $addWrapper = $('.js-add-chat-wrapper');
    if($addWrapper.length){
      $addWrapper.before('<li><a href="/chats/"+url>'+ _.escape(name) +'</a></li>');
    }else{
      var $wrapper = $('.navbar-nav');
      $wrapper.append('<li><a href="/chats/"+url>'+ _.escape(name) +'</a></li>');
    }
  };

  $('.js-change-role, .js-change-chats').click(function(e){
    e.preventDefault();
    $(this).parent().hide().next().show();
  });

  $('.js-cancel-role').click(function(e){
    e.preventDefault();
    $(this).parent().hide().prev().show();
  });

  $('.js-cancel-chats').click(function(e){
    e.preventDefault();
    $(this).parents('.chats-update').hide().prev().show();
  });

  $('.js-apply-role').click(function(e){
    e.preventDefault();

    var $wrap = $(this).parents('.item'),
        $elem = $(this),
        userRole = $wrap.find('select').val(),
        userId = $(this).data('id');

    io.socket.post('/user/changeRole', {
      role: userRole,
      id: userId
    } ,function(resp){
      $elem.parent().hide().prev().show();
      if(resp.role){
        $wrap.find('.js-role').text(resp.role);
      }
      if(resp.error){
        $('.js-logout').click();
      }
    })
  });



})(jQuery);
