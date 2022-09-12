import React from "react";
import { Redirect } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import { doLogin } from 'api'
import { tokenName, userName } from 'api/const'
import { errorNoti } from "components/Notifi"
import { registerURL } from "config";

import loginBackgroundImg from "assets/img/login-bg.jpg";

export default function Login(props) {
  const [loginForm, setLoginFrom] = React.useState({
    username: localStorage.getItem(userName)
  })
  const [path, setPath] = React.useState("")
  const handle_login = (e) => {
    e.preventDefault();
    doLogin(loginForm)
    .then(res => {
      if (res.status === 200) {
        localStorage.setItem(tokenName, res.data.token);
        localStorage.setItem(userName, res.data.user.username);
        if (props.location.state) {
          setPath(props.location.state.from);
        } else {
          setPath("/")
        }
    }})
    .catch(e => {
      errorNoti("Invalid user or password")
    })
  };

  const loginBackground = {
    backgroundImage: "url(" + loginBackgroundImg + ")"
  };

  return (
    <div style={loginBackground} className="login-bg">
      <div className="login-bg-mask">
        <div className="login-page">
          <ToastContainer/>
          <div className="form">
            <form className="login-form" onSubmit={e => handle_login(e)}>
              <input required type="text" placeholder="username"
                onChange={e => setLoginFrom({...loginForm, username: e.target.value})}
                defaultValue={localStorage.getItem(userName)}
              />
              <input required type="password" placeholder="password"
                onChange={e => setLoginFrom({...loginForm, password: e.target.value})}
              />
              <button type="submit">login</button>
              {/* <a href={registerURL}>Create account</a> */}
            </form>
          </div>
          { path && <Redirect to={path}/>}
        </div>
      </div>
    </div>
  )
}