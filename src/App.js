import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Login from './components/home/login'
import Signup from './components/home/signup'
import VerifyOtp from './components/home/verifyotp';
import Dashboard from './components/dashboard/index'


class App extends Component {
  render() {
    return (
    <Router>
        <div>
          <Switch>
              <Route exact path='/' component={Login} />
              <Route path='/dashboard' component={Dashboard} />
              <Route path='/signup' component={Signup} />
              <Route path='/verifyotp' component={VerifyOtp} />
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;