import React from 'react';
import ReactDOM from 'react-dom'
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Link
} from 'react-router-dom';
import Login from './login.jsx';
import Home from './home.jsx';
import League from './league.jsx';
import MyTeam from './myteam.jsx';
import Matchups from './matchups.jsx';
import Draft from './draft.jsx';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoggedIn: true,
      username: "",
      password: "",
      myTeam: {},
      currentForeignTeam: "",
      foreignTeam: {},
      league: ""
    };

    this.handleLogOut = this.handleLogOut.bind(this);
  }

  validateEntry() {
    // make sure characters are allowed
  }

  handleSignIn(event) {
    console.log('clicked');
    fetch('/home', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: event.target.value,
        password: event.target.value
      }),
    })
    .then(console.log(JSON.stringify(response)))
    .catch((error) => {
      console.error(error);
    });
    event.preventDefault();
  }

  handleLogOut(event) {
    this.setState({
      isLoggedIn: false
    })
  }

  handleCheckOutTeam(event) {
    this.setState({
      currentForeignTeam: "",
      foreignTeam: "",
      foreignPlayers: []
    })
  }

  render () {
    // if isLoggedIn = true, conditionally render / to lead to Home
    const isLoggedIn = this.state.isLoggedIn;
    let logout = null;
    let rootPath = null;
    let navBar = null

    // <Route exact path="/" render={() => (isloggedIn ? (<Redirect to="/dashboard"/>) : (<PublicHomePage/>))}/>

    if (isLoggedIn) {
      logout =  <button id="logout" onClick={this.handleLogOut}><Link to="/">Log out</Link></button>;
      rootPath = <Route exact path="/app" component={App}/>
      navBar = (<div id="navbar">
        {logout}
        <ul>
          <li id="navbar-item"><Link to="/home">Home</Link></li>
          <li id="navbar-item"><Link to="/league">League</Link></li>
          <li id="navbar-item"><Link to="/myteam">My Team</Link></li>
          <li id="navbar-item"><Link to="/matchups">Matchups</Link></li>
          <li id="navbar-item"><Link to="/draft">Draft</Link></li>
        </ul>

        <Route path="/home" component={Home}/>
        <Route path="/league" render={ props => (<League handleCheckOutTeam={this.handleCheckOutTeam.bind(this)}/>)} />
        <Route path="/myteam" component={MyTeam}/>
        <Route path="/matchups" component={Matchups}/>
        <Route path="/draft" component={Draft}/>
      </div>);
    } else {
      rootPath = (<Route exact path="/"
                         render={ props => (<Login handleSignIn={this.handleSignIn.bind(this)}
                         validateEntry={this.validateEntry.bind(this)} />)}
                         />);
    }
    return (
      <MuiThemeProvider>
      <div>
        {navBar}
        <br />

        {rootPath}
      </div>
      </MuiThemeProvider>
    );
  }
}

ReactDOM.render((
  <Router>
    <App />
  </Router>), document.getElementById('app'));
