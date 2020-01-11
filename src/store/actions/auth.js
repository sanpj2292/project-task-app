import * as actionTypes from './actionTypes';
import axios from 'axios';
import constants from '../../constants';
import {push} from 'react-router-redux';

export const authCheckState = () => {
    return dispatch => {
        const token = localStorage.getItem('token');
        if (token === undefined) {
            dispatch(authLogout());
        } else {

            const expirationDate = new Date(localStorage.getItem('expirationDate'));

            if (expirationDate <= new Date()) {
                dispatch(authLogout());
            } else {
                dispatch(authSuccess(token));
                dispatch(checkAuthTimeOut((expirationDate.getTime() - new Date().getTime()) / 1000));
            }
        }
    };
};


export const authStart = () => {
    return {
        type: actionTypes.AUTH_START,
    }
};

export const authSuccess = (token) => {
    return {
        type: actionTypes.AUTH_SUCCESS,
        token: token,
    }
};

export const authFail = err => {
    return {
        type: actionTypes.AUTH_FAIL,
        error: err,
    }
};

export const authLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('expirationDate');
    return {
        type: actionTypes.AUTH_LOGOUT
    };
};

export const checkAuthTimeOut = expirationTime => {
    return dispatch => {
        setTimeout(() => {
            dispatch(authLogout());
        }, expirationTime * 1000);
    };
};

export const authLogin = (username, password) => {
    return dispatch => {
        dispatch(authStart());
        axios.post(constants.HOST + '/rest-auth/login/', {
            username: username,
            password: password,
        })
            .then(res => {
                const token = res.data.key;
                const expirationDate = new Date(new Date().getTime() + 3600 * 1000);
                localStorage.setItem('token', token);
                localStorage.setItem('expirationDate', expirationDate);
                dispatch(authSuccess(token));
                dispatch(checkAuthTimeOut(3600));
                dispatch(push('/project/'))
            })
            .catch(err => dispatch(authFail(err)));
    }
};

export const authSignUp = (username, email, password1, password2) => {
    return dispatch => {
        dispatch(authStart());
        axios.post(constants.HOST + '/rest-auth/registration/', {
            username: username,
            email: email,
            password1: password1,
            password2: password2,
        }).then(res => {
            const token = res.data.key;
            const expirationDate = new Date(new Date().getTime() + 3600 * 1000);
            localStorage.setItem('token', token);
            localStorage.setItem('expirationDate', expirationDate);
            dispatch(authSuccess(token));
            dispatch(checkAuthTimeOut(3600));
        }).catch(err => dispatch(authFail(err)));
    }
};