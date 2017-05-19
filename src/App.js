import React, { Component } from 'react';
import Auth0Lock from 'auth0-lock';
import {Grid, Row, Col} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import Header from './Components/Header';
import Dashboard from './Components/Dashboard';
import Home from './Components/Home';



class App extends Component {

  constructor(props){
    super(props);
    this.state = {
      idToken: '',
      profile: {}
    }
  }

  static defaultProps = {
    clientID: 'y3rIeRRhAE4Wga3NlQ71WyBTj1q2sE57',
    domain: 'spaceforestchu.auth0.com'
  }

  componentWillMount(){
    this.lock = new Auth0Lock(this.props.clientID, this.props.domain);


    this.lock.on('authenticated', (authResult) => {
      this.lock.getProfile(authResult.idToken, (error, profile) => {
        if(error){
          console.log(error);
          return
        }
        this.setData(authResult.idToken, profile);
      });
    });
    this.getData();
  }

  setData(idToken, profile){
    localStorage.setItem('idToken', idToken);
    localStorage.setItem('profile', JSON.stringify(profile));
    this.setState({
      idToken: localStorage.getItem('idToken'),
      profile: JSON.parse(localStorage.getItem('profile'))
    });
  }

  getData(){
    if(localStorage.getItem('idToken') != null) {
      this.setState({
        idToken: localStorage.getItem('idToken'),
        profile: JSON.parse(localStorage.getItem('profile'))
      }, () => {
        console.log(this.state);
      });
    }
  }

  showLock(){
    this.lock.show();
  }

  logout(){
    this.setState({
      idToken: '',
      profile: ''
    }, () => {
      localStorage.removeItem('idToken');
      localStorage.removeItem('profile');
    });
  }

  render() {

    let page;
    if(this.state.idToken){
      page = <Dashboard
        lock={this.locl}
        idToken={this.state.idToken}
        profile={this.state.profile}
        />
    } else {
      page = <Home />
    }
    return (
      <div className="App">
        <Header
          onLoginClick={this.showLock.bind(this)}
          lock={this.lock}
          idToken={this.state.idToken}
          profile={this.state.profile}
          onLogoutClick={this.logout.bind(this)}
          />
        <Grid>
          <Row>
            <Col xs={12} md={12}>
              {page}
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

export default App;
