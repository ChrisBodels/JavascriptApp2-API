var _ = require('lodash')
var datastore = require('../datastore');

// Get list of games
exports.index = function(req, res) {
    return res.json(200, datastore.games);
} ;

// Creates a new game in datastore.
exports.create = function(req, res) {
    var nextId = 0
    var last = _.last(datastore.games)
    if (last != undefined) {
       nextId = last.id + 1
    } else {
      nextId = 1
    }
    var game = {
       id: nextId,
       name: req.body.name,
       desc: req.body.desc,
       img: req.body.img,
       link: req.body.link,
       year: req.body.year,
       commentsArray: []
    };
    datastore.games.push(game)
    return res.json(201, game);
};

// Update an existing game in datastore.
exports.update = function(req, res) {
      var index = _.findIndex(datastore.games, function(game) {
           return game.id == req.params.id;
        } );      
      if (index !== -1) {
          datastore.games.splice(index, 1, 
               {name: req.body.name, desc: req.body.desc , 
                         img: req.body.img, link: req.body.link, year: req.body.year});
          return res.send(200);
        } 
      return res.send(404) ;
};

// Deletes a game from datastore.
exports.destroy = function(req, res) {
    var elements = _.remove(datastore.games , 
           function(game) {
              return game.id == req.params.id;
        });  
     if (elements.length == 1) {
        return res.send(200);
        }
      else
        {
         return res.send(404)
      }
};
