import React from 'react';
import { Router, Route, Link, IndexRoute, browserHistory, IndexLink } from 'react-router';
import Button from 'react-button';
import request from 'superagent';
import Games from './gameList.js';

/**
  *@author Chris Bodels
  *
  *
  */



var games1 = Games;
var ownedGames = [];
var comments = [];





function containsObject(obj, array)
{
  var i;
  for (i=0; i < array.length; ++i)
  {
    if(array[i] === obj)
    {
      return true;
    }
  }
  return false;
}


function sorterRelease(array)
{
  array.sort(function sortGamesRelease(a, b)
  {
    return parseFloat(a.year) - parseFloat(b.year);
  });
  this.forceUpdate();
}

function sorterAlphabetical(array)
{
  array.sort(function sortGamesAlphabetically(a, b)
  {
    return a.name.localeCompare(b.name);
  });
  this.forceUpdate();
}

function update()
{
  var that = this;
  request.get('http://0.0.0.0:5000/api/games').end(function(error, res){
    var json = JSON.parse(res.text);
    localStorage.clear();
    localStorage.setItem('games', JSON.stringify(json))
    that.setState({});
  })
}



class Home extends React.Component
{
  render()
  {
    return(
      <div>
        <h1>Welcome to my online video game store!</h1>
        <p>I made this web app to simulate a simple storefront for selling video games online. Enjoy!</p>
      </div>
    );
  }
};


class Store extends React.Component
{
  buttonClicked(game)
  {
    if(containsObject(game, ownedGames) === true)
    {
      alert("You already own this game, you cannot purchase it again.");
    }
    else
    {
      var result = confirm("Are you sure you want to buy this game?");
      if(result === true)
      {
        ownedGames.push(game);
        alert("Game purchased! You should now see it in your library.");
      }
      else
      {
    
      }
    }
  }
  removeGame(game)
  {
    var that = this;
    request.del('http://0.0.0.0:5000/api/games/' + game.id).end(function(err, res){
      if(err || !res.ok){
        alert('Error deleting');
      }
      else{
        request.get('http://0.0.0.0:5000/api/games').end(function(error, res){
          if(res){
            var json = JSON.parse(res.text);
            localStorage.clear();
            localStorage.setItem('games', JSON.stringify(json))
            that.setState({});
          }
          else{
            console.log(error);
          }
        });
      }
    });
  }
  updateGame(id, name, desc, img, link, year)
  {
      console.log(name);
      var that = this;
      request.put('http://0.0.0.0:5000/api/games/' + id )
      .send({ name: name, desc: desc, img: img, link: link, year: year})
      .set('Content-Type', 'application/json').end(function(err, res){
        if (err || !res.ok) {
          alert('Error updating');
        } else {
          request.get('http://0.0.0.0:5000/api/games').end(function(error, res){
            if (res) {
              var json = JSON.parse(res.text);
              localStorage.clear();
              localStorage.setItem('games', JSON.stringify(json)) ;
              that.setState( {}) ;                
            } else {
              console.log(error );
            }
          }); 
        }
      });       
  }
  render()
  {
    update.bind(this)
    var games = localStorage.getItem('games') ?
      JSON.parse(localStorage.getItem('games')) : [];
    const gamesList = games.map(game =>{
      var gameLink = "/store/" + game.name;
      return(
          <li key={game.id}>
            <img src={require(game.img)}/>
            <h3><Link to={gameLink}>{game.name}</Link></h3>
            <p>{game.desc}</p>
            <p>Released: {game.year}</p>
            <p><a href={game.link} target="_blank">Official Website</a></p>
            <Button onClick={this.buttonClicked.bind(this, game)}>Purchase</Button>
            <Button onClick={this.removeGame.bind(this, game)}>Remove Game</Button>
            <form onSubmit={this.updateGame.bind(this, game.id, name, game.desc, game.img, game.link, game.year)}>
              <input type="text" placeholder="New name" name="name" />
              {/*<input type="text" placeholder="New description" desc="name" />
              <input type="text" placeholder="New release year" year="year" />
              <input type="text" placeholder="New image path" img="img" />
              <input type="text" placeholder="New link" link="link" />*/}
              <input type="submit" value="Submit" />
            </form>
          </li>
      )
    })
    return(
      <div>
        <Button onClick={sorterAlphabetical.bind(this, games)}>Sort Alphabetically</Button>
        <Button onClick={sorterRelease.bind(this, games)}>Sort by Release Date</Button>
        <Button onClick={update.bind(this)}>Update Page</Button>
        <iframe width="0" height="0" name="dummyFrame" id="dummyFrame" />
        <form method="POST" action="http://localhost:5000/api/games" target="dummyFrame">
          <input type='text' placeholder="Game name" name="name"  />
          <input type="text" placeholder="Description" name="desc" />
          <input type="text" placeholder="Release year" name="year"  />
          <input type="text" placeholder="Image Path" name="img"  />
          <input type="text" placeholder="Website link" name="link" />
          <input type="submit" value="Add Game" />
        </form>
        <h1>Here are all the games that are currently available</h1>
        <ul id="items">
          {gamesList}
        </ul>
      </div>
    )
  }
};



class Library extends React.Component
{
  render()
  {
    const gamesList = ownedGames.map(game =>{
      var gameLink = "/store/" + game.name;
      return(
        <li key={game.id}>
          <img src={require(game.img)}/>
          <h3><Link to={gameLink}>{game.name}</Link></h3>
          <p>{game.desc}</p>
          <p>Released: {game.year}</p>
          <p><a href={game.link} target="_blank">Official Website</a></p>
        </li>
      )
    })
    return(
      <div>
        <Button onClick={sorterAlphabetical.bind(this, ownedGames)}>Sort Alphabetically</Button>
        <Button onClick={sorterRelease.bind(this, ownedGames)}>Sort by Release Date</Button>
        <h1>Here are all the games you currently own!</h1>
        <ul id="items">
          {gamesList}
        </ul>
      </div>
    );  
  }
};


class gamePage extends React.Component
{
  render()
  {
    var gameName = this.props.params.game;
    var i = games1.findIndex(game =>{
      if(game.name === gameName)
      {
        return game;
      }    
    
    });
    return( 
      <div id="gamePage">
        <img src={require(games1[i].img)} />
        <h1>{games1[i].name}</h1>
        <p>{games1[i].desc}</p>
        <ul>
          <p>Released: {games1[i].year}</p>
          <p><a href={games1[i].link} target="_blank">Official Website</a></p>
        </ul>
        <CommentBox comments={comments} gameName={gameName}/>
      </div>    
    )
  }
}


class CommentsPage extends React.Component
{
  render()
  {
    return(
      <div>
        <CommentBox comments={comments} gameName="N/A"/>
      </div>
    )
  }
}


var Comment = React.createClass({
  render: function(){
    return(
      <div className="comment">
        <h2 className="commentAuthor">
          {this.props.author} - {this.props.gameName}
        </h2>
        {this.props.children}
      </div>
    )
  }
})


var CommentForm = React.createClass({
  getInitialState: function(){
    return {author: '', text: ''}
  },
  handleAuthorChange: function(e){
    this.setState({author: e.target.value})
  },
  handleTextChange: function(e){
    this.setState({text: e.target.value})
  },
  handleSubmit: function(e){
    e.preventDefault();
    var author = this.state.author.trim()
    var text = this.state.text.trim()
    if(!text || !author){
      return
    }
    this.props.onCommentSubmit({author: author, text: text})
    this.setState({author: '', text: ''})
  },


  render: function(){
    var gameName = this.props.gameName
    if(gameName != "N/A")
    {
    return(
      <form className="commentForm" onSubmit={this.handleSubmit}>
        <input
          type="text"
          placeholder="Your name"
          value={this.state.author}
          onChange={this.handleAuthorChange}
        />
        <input
          type="text"
          placeholder="Tell people what you think of the game..."
          value={this.state.text}
          onChange={this.handleTextChange}
        />
        <input type="submit" value="Post" />
      </form>
    )
    }
    else
    {
      return(<p> </p>)
    }
  }
})




var CommentList = React.createClass({
  handleUpvote: function(id, gameName){
    var index1 = comments.findIndex(comment =>{
      if(comment.id === id)
        return comment
    })
    comments[index1].score++
    var index = games1.findIndex(game =>{
      if(game.name === gameName)
        return game
    })
    var index2 = games1[index].commentsArray.findIndex(comment =>{
      if(comment.id === id)
        return comment
    })
    games1[index].commentsArray[index2].score++
    console.log(games1[index].commentsArray[index2].comment)
    this.forceUpdate()
  },

  handleDownvote: function(id, gameName){
    var index1 = comments.findIndex(comment =>{
      if(comment.id === id)
        return comment
    })
    comments[index1].score--
    var index = games1.findIndex(game =>{
      if(game.name === gameName)
        return game
    })
    var index2 = games1[index].commentsArray.findIndex(comment =>{
      if(comment.id === id)
        return comment
    })
    games1[index].commentsArray[index2].score--
    console.log(games1[index].commentsArray[index2].comment)
    this.forceUpdate()
  },

  render: function(){
    var gameName = this.props.gameName
    var index = games1.findIndex(game =>{
      if(game.name === gameName)
      {
        return game
      }
    })
    if(gameName != "N/A")
    {
      var commentNodes = games1[index].commentsArray.map(comment =>{
        return(
          <Comment author={comment.author} key={comment.id} gameName={comment.game}>
            <ul>
              {comment.comment}
            </ul>
            Comment Score: {comment.score}
              <Button type="submit" onClick={this.handleUpvote.bind(this, comment.id, comment.game)}>Upvote!</Button>
              <Button type="submit" onClick={this.handleDownvote.bind(this, comment.id, comment.game)}>Downvote!</Button>
          </Comment>
        )
      })
    }
    else
    {
      var commentNodes = comments.map(comment =>{
        return(
        <Comment author={comment.author} key={comment.id} gameName={comment.game}>
          <ul>
            {comment.comment}
          </ul>
          Comment Score: {comment.score}
          <Button type="submit" onClick={this.handleUpvote.bind(this, comment.id, comment.game)}>Upvote!</Button>
          <Button type="submit" onClick={this.handleDownvote.bind(this, comment.id, comment.game)}>Downvote!</Button>
        </Comment>
      )
      })
    }
    return(
      <div className ="commentList">
        {commentNodes}
      </div>
    )
  }
})



var CommentBox = React.createClass({
  handleCommentSubmit: function(comment){
    var gameName = this.props.gameName
    var id = comments.length
    comments.push({id: id, game: gameName, author: comment.author, comment: comment.text, score: 1})
    var index = games1.findIndex(game =>{
      if(game.name === gameName)
      {
        return game
      }
    })
    
1[index].commentsArray.push({id: id, game: gameName, author: comment.author, comment: comment.text, score: 1})
    this.forceUpdate()
  },
  
  render: function(){
    return(
      <div className="commentBox">
        <h1>Comments</h1>
        <CommentList comments={this.props.comments} gameName={this.props.gameName}/>
        <CommentForm onCommentSubmit={this.handleCommentSubmit} gameName={this.props.gameName} />
      </div>
    )
  }
})




class NotFound extends React.Component
{
  render()
  {
    return(
      <div>
        <h1>404... Page not found</h1>
      </div>
    );
  }
};


var Nav = React.createClass(
{
  render: function()
  {
    return(
      <div id="Nav">
        <ul id="nav">
          <li><IndexLink activeClassName="active" to='/'>Home</IndexLink>&nbsp;</li>
          <li><IndexLink activeClassName="active" to='/store'>Store</IndexLink>&nbsp;</li>
          <li><IndexLink activeClassName="active" to='/library'>Your Library</IndexLink>&nbsp;</li>
          <li><IndexLink activeClassName="active" to='/comments'>Comments</IndexLink>&nbsp;</li>
        </ul>
      </div>
    );
  }
});



var Container = (props) => <div>
  <Nav />
  {props.children}
</div>


  class App extends React.Component
  {
    render()
    {
      return (
        <Router history={browserHistory}>
          <Route path='/' component={Container}>
            <IndexRoute component={Home} />
            <Route path='/Store' component={Store}/>
            <Route path='/Library' component={Library} />
            <Route path='/Store/:game' component={gamePage} />
            <Route path='/Comments' component={CommentsPage} />
            <Route path='*' component={NotFound} />
          </Route>
        </Router>
      );
    }
  };  


export default App;
