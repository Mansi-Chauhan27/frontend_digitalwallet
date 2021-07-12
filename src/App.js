import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Login from './components/home/login'
import Signup from './components/home/signup'
import VerifyOtp from './components/home/verifyotp';
import Dashboard from './components/dashboard/index';
import ButtonAppBar from './components/common/buttonappbar';
import Customer from './components/customer';
import { ToastContainer } from "react-toastify";
import Retailer from './components/retailer';


class App extends Component {
  
  render() {
    console.log(localStorage.getItem('is_admin'))
    var comp = localStorage.getItem('user_type')==='admin'?Dashboard:localStorage.getItem('user_type')==='owner'?Retailer :Customer
    // var comp = Dashboard
    return (
    <Router>
        <div>
          {/* {console.log()} */}
          <ButtonAppBar />
          <Switch>
              <Route exact path='/' component={Login} />
              <Route path='/dashboard' component={comp}/>
              <Route path='/signup' component={Signup} />
              <Route path='/verifyotp' component={VerifyOtp} />
              <Route path='/customer' component={Customer} />
              <Route path='/retailer' component={Retailer} />
              
          </Switch>
          <ToastContainer />
        </div>
      </Router>
    );
  }
}

export default App;