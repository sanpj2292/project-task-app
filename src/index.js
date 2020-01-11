import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { createStore, compose, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { Provider } from "react-redux";
import reducer from './store/reducers/auth';
import {createBrowserHistory} from 'history';
import {routerMiddleware } from 'react-router-redux';
import { Router } from 'react-router-dom';

const composeEnhances = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const history = createBrowserHistory();
const store = createStore(reducer,
    composeEnhances(applyMiddleware(thunk, routerMiddleware(history)))
);
const app = (
    <Provider store={store}>
        <Router history={history}>
            <App history={ history }/>
        </Router>
    </Provider>
);


ReactDOM.render(app, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
