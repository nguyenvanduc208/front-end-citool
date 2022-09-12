import { tokenName, userName } from 'api/const'


export const logged_in = () => {
  let token =  localStorage.getItem(tokenName);
  let user =  localStorage.getItem(userName);
  if (token && user) {
    return true
  }
  return false
}

