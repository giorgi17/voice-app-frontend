import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
// import {BrowserRouter} from 'react-router-dom';
import {Router} from 'react-router-dom';
import { createBrowserHistory } from "history";

window.history.scrollRestoration = 'manual';

// Check if page cache main object is created and create a new one if not 
if (!localStorage.getItem('mainPageCacheObject'))
  localStorage.setItem('mainPageCacheObject', JSON.stringify({}));
// Remove cached pages after page refresh or tab close
window.onbeforeunload = () => {
  localStorage.removeItem('mainPageCacheObject');
}

const history = createBrowserHistory(); // or createHashHistory()

ReactDOM.render(<Router history={history}> <App /> </Router>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
