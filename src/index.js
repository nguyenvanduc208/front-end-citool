/*!

=========================================================
* Light Bootstrap Dashboard React - v1.3.0
=========================================================

* Product Page: https://www.creative-tim.com/product/light-bootstrap-dashboard-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/light-bootstrap-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from "react";
import ReactDOM from "react-dom";

import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import "./assets/css/animate.min.css";
import "./assets/sass/light-bootstrap-dashboard-react.scss?v=1.3.0";
import "./assets/css/demo.css";
import "./assets/css/pe-icon-7-stroke.css";

import { Provider} from 'react-redux';
import store from './store';
import AdminLayout from "layouts/Admin.jsx";
import Login from "views/Login"
// import Register from "views/Register"
import "./assets/css/login.css";
import { logged_in } from "api/authen";
// import {adminLayout, sastURL, loginURL, registerURL, dashBoard} from "config";
import {adminLayout, sastURL, loginURL, dashBoard} from "config";


function PrivateRoute(route_props) {
  return (
    <Route render={props =>
        logged_in() ? (
          <route_props.render {...props}/>
        ) : (
          <Redirect to={{pathname: loginURL, state: { from: props.location.pathname } }} />
        )
      }
    />
  );
}

ReactDOM.render(
  (
    <Provider store={store}>
      <BrowserRouter>
        <Switch>
          <Route path={loginURL} component={Login}/>
          {/* <Route path={registerURL} component={Register}/> */}
          <PrivateRoute path={adminLayout} render={AdminLayout} />
          <Redirect from="/" to={adminLayout + dashBoard} />
        </Switch>
      </BrowserRouter>
    </Provider>
  ), document.getElementById("root")
);
