import React from 'react';
import './App.scss';
import Header from './components/Header/Header';
import {Route, Switch} from 'react-router-dom';
import jwt_decode from "jwt-decode";
import setAuthToken from "./utils/setAuthToken";
import { setCurrentUser, logoutUser } from "./actions/authActions";
import PrivateRoute from "./components/private-route/PrivateRoute";
import Dashboard from "./components/dashboard/Dashboard";
import Welcome from './components/Welcome/Welcome';
import About from './components/About/About';
// import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import { Provider } from "react-redux";
import store from "./store";

import Navbar from "./components/layout/Navbar";
import Landing from "./components/layout/Landing";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";

import { Button } from '@material-ui/core';
import CssBaseline from '@material-ui/core/CssBaseline';


// Check for token to keep user logged in
if (localStorage.jwtToken) {
  // Set auth token header auth
  const token = localStorage.jwtToken;
  setAuthToken(token);
  // Decode token and get user info and exp
  const decoded = jwt_decode(token);
  // Set user and isAuthenticated
  store.dispatch(setCurrentUser(decoded));

// Check for expired token
const currentTime = Date.now() / 1000; // to get in milliseconds
if (decoded.exp < currentTime) {
  // Logout user
  store.dispatch(logoutUser());
  // Redirect to login
  window.location.href = "./login";
}
}

function App() {
  return (
    <Provider store={store}> 
    <CssBaseline/>
      <div className="App">
          {/* <Header /> */}
          <main>
            {/* <Route path="/messages/" component={AllMessagesPage} /> */}
            {/* <Route path="/new-message/" component={NewMessagePage} /> */}
            {/* <Navbar /> */}
            {/* {Header} */}

            {/* <Button variant="contained" color="primary">
              Hello World
            </Button> */}
            
            {/* <Route exact path="/" component={Login} /> */}
            <Route exact path="/" component={Welcome} />
            <Route exact path="/about" component={About} />
            <Route exact path="/register" component={Register} />
            <Route exact path="/login" component={Login} />

            <Switch>
              <PrivateRoute exact path="/dashboard" component={Dashboard} />
            </Switch>
          </main>
      </div>
    </Provider>
  );
}

export default App;
