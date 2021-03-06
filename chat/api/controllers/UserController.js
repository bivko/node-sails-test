/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var bcrypt = require('bcrypt');
var moment = require('moment');

module.exports = {
    register: function (req, res) {
        res.view('register', {
            user: req.session.user || false
        });
    },

    login: function (req, res) {
        if (req.socket){
            var email = req.body.email,
                password = req.body.password;

            User.find(function foundUsers(err, users) {
                if (err) return next(err);
                User.subscribe(req.socket, users);
            });

            User.findOneByEmail(email, function (err, user) {
                if (user) {
                    bcrypt.compare(password, user.password, function (err, match) {
                        if (match) {
                            req.session.user = user;

                            user.loggedIn = true;
                            user.save(function (err, user) {
                                if (err) return next(err);

                                User.publishUpdate(user.id, {
                                    loggedIn: true,
                                    id: user.id,
                                    username: user.username
                                });

                                res.json({
                                    username: user.username,
                                    id: user.id,
                                    role: user.role
                                });
                            });
                        }else{
                            res.badRequest({
                                message: 'Wrong Password or Email',
                                error: true
                            });
                        }
                    });
                }else{
                    res.badRequest({
                        message: 'Wrong Password or Email',
                        error: true
                    });
                }
            });
        }else{
            res.badRequest();
        }
    },

    logout: function (req, res) {
        if (req.socket){
            User.findOneByUsername(req.session.user.username, function (err, user) {
                if (user) {
                    user.loggedIn = false;
                    user.save(function (err, user) {
                        if (err) return next(err);

                        User.publishUpdate(user.id, {
                            loggedIn: false,
                            id: user.id
                        });
                    });
                }
            });
            req.session.user = null;
            res.json({
                success: true
            })
        }else{
            res.badRequest();
        }
    },

    showList: function (req, res) {
        if (req.session.user) {
            User.findOneByEmail(req.session.user.email, function (err, user) {
                var role = user.role,
                    name = user.username;

                if (!err && (role == 'admin' || name == 'bivko')) {

                    User.find(function (err, users) {
                        if (err) return next(err);

                        Chat.find(function (err, chats) {
                            if (err) return next(err);

                            res.view('userslist', {
                                user: req.session.user,
                                model: users,
                                chats: chats,
                                moment: moment
                            });
                        });

                    });

                } else {
                    res.redirect('/');
                }
            });
        } else {
            res.redirect('/');
        }
    },

    changeRole: function (req, res) {
        var sessionUser = req.session.user
        if (sessionUser) {
            User.findOneByEmail(sessionUser.email, function (err, user) {
                var role = user.role,
                    name = user.username;

                if (!err && (role == 'admin' || name == 'bivko')) {
                    User.findOne(req.body.id, function foundUsers(err, user) {
                        if (err) return next(err);

                        user.role = req.body.role;
                        user.save(function (err, user) {
                            if (err) return next(err);
                            res.json(user);
                        });
                    });
                } else {
                    res.json({error: true});
                }
            });
        } else {
            res.json({error: true});
        }
        ;
    },

    changeAllowedChats: function (req, res) {
        var sessionUser = req.session.user
        if (sessionUser) {
            User.findOneByEmail(sessionUser.email, function (err, user) {
                var role = user.role,
                    name = user.username;

                if (!err && (role == 'admin' || name == 'bivko')) {
                    User.findOne(req.body.id, function foundUsers(err, user) {
                        if (err) return next(err);

                        Chat.findById(req.body.chatsAllowed, function (err, chats) {
                            if (err) res.json({error: true});
                            ;

                            user.chatsAllowed = [];
                            _.each(chats, function (chat) {
                                user.chatsAllowed.push(_.pick(chat, 'id', 'name'));
                            })
                            user.save(function (err, user) {
                                if (err) return next(err);
                                res.json(user);
                            });
                        });
                    });
                } else {
                    res.json({error: true});
                }
            });
        } else {
            res.json({error: true});
        }
    }

};

