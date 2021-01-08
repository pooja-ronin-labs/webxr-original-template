import React, {useState} from 'react';
import {connect} from 'react-redux';
import authService from '../../service/auth.service';
import {loginStart} from '../../store/auth/auth.action';
import HTTPService from '../../service/http.service';
import './style.scss'

const GuestLogin = ({saveUserToStore}) => {
  const [name, setName] = useState('');
  const handleInput = ({target}) => {
    setName(target.value);
  }
  const handleLogin = async () => {
    try {
      const data = await authService.guestLogin({username:name}); 
      saveUserToStore({authToken: data.token, user: data.user, janustoken: data.janustoken});
      HTTPService.saveHeader({key: 'Authorization', value: `Bearer ${data.token}`});
    } catch(e) {
      console.log(e)
    }
  }
  return (
    <div className="tempLoginWrapper">
      <div>
        <input type="text" placeholder="guest name" onChange={handleInput}/>
        <button onClick={handleLogin}>Login as Guest</button>
      </div>
    </div>
  )
}
const mapDispatchToProps = dispatch => {
  return {
    saveUserToStore: userData => dispatch(loginStart(userData))
  }
} 

export default connect(null, mapDispatchToProps)(GuestLogin);