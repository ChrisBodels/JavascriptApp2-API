module.exports = function(app) {

  app.use('/api/games', require('./game/index.js'));

  
  // All undefined asset or api routes should return a 404
  app.route('/:url(api|app|assets)/*')
   .get(function(req, res) {
    res.send(404);
  })

};
