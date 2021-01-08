import HTTPService from './http.service';
import storageService from './storage.service';
const baseAuthEndpoint = 'api/auth/'

const Cryptr = require('cryptr');
const cryptr = new Cryptr('lhtzuoozwohyrsbequlwxynkaxnnqxwi');
const authService = {
  async tempLogin() {
    try {
      const {data} = await HTTPService.post('api/auth/login?tempLogin=true');
      return data
    }catch(e) {
      console.log(e)
    }
  },
  async saveNordName(payload) {
    try {
      const {data} = await HTTPService.post('api/player/me/nordname', payload);
      return data
    }catch(e) {
      console.log(e)
    }
  },
  async getPuzzelState() {
    try{
      const {data} = await HTTPService.get('api/player/me/puzzlestate');
      return data;
    }catch(e) {
      console.log(e);
    }
  },
  async guestLogin(payload) {
    try {
      if(payload.oneplus_auth === false) {
        const {data} = await HTTPService.post(baseAuthEndpoint + 'login', payload);
        return data
      } else {
        const {data} = await HTTPService.postWithCred(baseAuthEndpoint + 'login', payload);
        return data
      }
    } catch(e) {
      console.log(e);
      return Promise.reject(e)
    }
  },
  async onePlusGetUserSession(){
    try {
      const {data} = await HTTPService.getWithCred(baseAuthEndpoint + 'oneplus_user_session', {withCredentials: true});
      return data;
    } catch(e) {
      console.log(e);
      return Promise.reject(e)
    }
  }
  
}

export default authService;