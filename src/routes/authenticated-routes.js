import React from "react";
import {Redirect, Route} from "react-router";

const AuthenticatedRoute = ({component: Component, ...rest}) => {
    console.log('TheHell: ',rest);
    const {location} = rest;
    console.log('Location: ', location);
    let list = location.pathname.split('/');
    let str = list[list.length -1];
    return (
        <Route {...rest}
               render={(props) => {
                   console.log(localStorage.getItem('token'));
                   return localStorage.getItem('token') ? (<Component  {...props}
                                                                   method={str && str==='create' ? 'post':'get'} />) :
                          (<Redirect to={{pathname: '/login', state: {from: props.location}}}/>)}
               }
        />
    )
};
export default AuthenticatedRoute;