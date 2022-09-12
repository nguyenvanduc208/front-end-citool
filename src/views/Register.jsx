import React from "react";
import { Redirect } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import { doRegister } from 'api'
import { errorNoti, successNoti } from "components/Notifi"
import { loginURL } from "config";


export default function Login(props) {
  const [regForm, setRegFrom] = React.useState({})
  const [redirect, setRedirect] = React.useState(false)
  const handle_login = (e) => {
    e.preventDefault();
    doRegister(regForm)
    .then(res => {
      if (res.status === 201) {
        successNoti("Created account successfuly! Please login to continue.")
        setRedirect(true)
    }})
    .catch(({response}) => {
      console.log(response.data)
      if (response.data.username) {
        errorNoti(response.data.username[0])
      }
      if (response.data.email) {
        errorNoti(response.data.email[0])
      }
    })
  };

  return (
    <div className="login-page">
      <ToastContainer/>
      <div className="form">
        <form className="login-form" onSubmit={e => handle_login(e)}>
          <input required type="text" placeholder="username"
            onChange={e => setRegFrom({...regForm, username: e.target.value})}
          />
          <input required type="email" placeholder="email"
            onChange={e => setRegFrom({...regForm, email: e.target.value})}
          />
          <input required type="password" placeholder="password"
            onChange={e => setRegFrom({...regForm, password: e.target.value})}
          />
          <button type="submit">register</button>
          <a href={loginURL}>Login</a>
        </form>
      </div>
      { redirect && <Redirect to={loginURL}/>}
    </div>
  )
}