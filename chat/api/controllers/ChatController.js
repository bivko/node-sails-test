/**
 * ChatController
 *
 * @description :: Server-side logic for managing chats
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
    create: function (req, res, next) {
        // all params ---  var params = req.params.all();
        var chatName = req.body.name,
            chatUrl = req.body.url;

        if (req.session.user) {
            User.findOneByEmail(req.session.user.email, function (err, user) {
                var role = user.role,
                    name = user.username;

                if (!err && (role == 'admin' || name == 'bivko')) {
                    Chat.create({
                        name: chatName,
                        url: chatUrl
                    }, function (err, chat) {
                        if (err) return next(err);
                        res.json(chat);
                    });
                } else {
                    res.json({error: true});
                }
            });
        } else {
            res.json({error: true});
        }
    },

    find: function (req, res, next) {
        var id = req.param('id')
        if (req.session.user) {
            User.findOneByEmail(req.session.user.email, function (err, user) {
                if (!err && user) {
                    if (id) {
                        Chat.findOne(id, function (err, chat) {
                            if (chat === undefined) return res.notFound();
                            if (err) return next(err);
                            res.json(chat);
                        });
                    } else {
                        var where = req.param('where');
                        if (_.isString(where)) {
                            where = JSON.parce(where);
                        }

                        var options = {
                            limit: req.param('limit') || undefined,
                            skip: req.param('skip') || undefined,
                            sort: req.param('sort') || undefined,
                            where: where || undefined
                        }

                        Chat.find(options, function (err, chats) {
                            if (chats === undefined) return res.notFound();
                            if (err) res.json(err);
                            res.json(chats);
                        });
                    }
                } else {
                    res.json({
                        error: true,
                        errorText: 'Not alloved to view chat list',
                        errorStatus: 403
                    });
                }
            });
        } else {
            res.json({
                error: true,
                errorText: 'Not alloved to view chat list',
                errorStatus: 403
            });
        }
    },

    openChat: function (req, res) {
        var user = false,
            chat = false,
            socket = req.socket;

        if (req.session.user) {
            user = req.session.user;
        }
        if (req.param('chat') && user) {
            if (req.session.user) {
                User.findOneByEmail(req.session.user.email, function (err, user) {
                    var role = user.role,
                        name = user.username;

                    if (!err && (role == 'admin' || name == 'bivko' || user.chatsAllowed.indexOf(req.param('chat')))) {
                        Chat.findOne(req.param('chat'), function (err, chat) {
                            if (err) res.json(err);

                            console.log('111', sails.sockets.socketRooms(socket));
                            sails.sockets.join(socket, 'chat-' + chat.id);
                            console.log('2222', sails.sockets.socketRooms(socket));

                            user.location = chat.id;
                            user.save(function (err, user) {
                                if (err) return next(err);

                                User.publishUpdate(user.id, user);

                                return res.view('homepage', {
                                    user: user,
                                    chat: chat
                                });
                            });
                        });
                    } else {
                        res.redirect('/');
                    }
                });
            }
        } else {
            res.view('homepage', {
                user: user,
                chat: chat
            });
        }

    }

};

