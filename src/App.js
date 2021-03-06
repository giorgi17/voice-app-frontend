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
import ProfileEdit from './components/dashboard/Menu/Profile/ProfileEdit/ProfileEdit';
// import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import { Provider } from "react-redux";
import store from "./store";

import Navbar from "./components/layout/Navbar";
import Landing from "./components/layout/Landing";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import UserProfile from './components/dashboard/UserProfile/UserProfile';
import Followers from './components/dashboard/UserProfile/Followers/Followers';
import Followings from './components/dashboard/UserProfile/Followings/Followings';
import SearchView from './components/dashboard/MenuResponsive/Search/SearchView/SearchView';
import RecordVoiceView from './components/dashboard/MenuResponsive/RecordVoice/RecordVoiceView/RecordVoiceView';
import NotificationsView from './components/dashboard/MenuResponsive/Notifications/NotificationsView/NotificationsView';
import ProfileView from './components/dashboard/Menu/Profile/ProfileView/ProfileView';
import ProfileEditPicture from './components/dashboard/Menu/Profile/ProfileEdit/ProfileEditPicture/ProfileEditPicture';
import Options from './components/dashboard/Menu/Profile/ProfileEdit/Options/Options';
import ChangePassword from './components/dashboard/Menu/Profile/ProfileEdit/ChangePassword/ChangePassword';
import EditPostView from './components/dashboard/MenuResponsive/RecordVoice/EditPostView/EditPostView';

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
            {/* <Route exact path="/profile" component={Profile} /> */}
            <PrivateRoute exact path='/profile/:userId' component={UserProfile} />
            <PrivateRoute exact path='/profile/:userId/followers' component={Followers} />
            <PrivateRoute exact path='/profile/:userId/following' component={Followings} />
            <PrivateRoute exact path='/account/edit' component={ProfileEdit} />
            <PrivateRoute exact path='/account/edit/avatarImage' component={ProfileEditPicture} />
            <PrivateRoute exact path='/account/edit/password' component={ChangePassword} />
            <PrivateRoute exact path='/account/options' component={Options} />
            <PrivateRoute exact path='/search' component={SearchView} />
            <PrivateRoute exact path='/new-post' component={RecordVoiceView} />
            <PrivateRoute exact path='/edit-post/:postId/:authorId/:index/:cacheRoute' component={EditPostView} />
            <PrivateRoute exact path='/notifications' component={NotificationsView} />

            <Switch>
              <PrivateRoute exact path="/dashboard" component={Dashboard} />
            </Switch>
          </main>
      </div>
    </Provider>
  );
}

export default App;
