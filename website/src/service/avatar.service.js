import HTTPService from './http.service';
import store from '../store/store';

const avatarService = {

    root_url: 'api/player/',

    getUserID()
    {
        let app_state = store.getState();
        if(app_state.auth && app_state.auth.user && app_state.auth.user._id)
        {
            return app_state.auth.user._id;
        }
        else
        {
            return "me";
        }
    },

    getBearerToken()
    {
        return store.getState().auth.authToken;
    },

    async uploadPhoto(queryBody) {
        try {
            let id = this.getUserID();
            
            let url = this.root_url + 'me/avatar/upload';
            const { data } = await HTTPService.post(url, queryBody);
            return data;
        } catch (e) {
            console.log(e);
            return Promise.reject(e);
        }
    },

    async getAvatarStatus() {
        try {
            let id = this.getUserID();
            
            let url = this.root_url + 'me/avatar/status';
            const { data } = await HTTPService.get(url);
            return data;
        } catch (e) {
            console.log(e);
            return Promise.reject(e);
        }
    },

    async getHairstyles() {
        try {
            let id = this.getUserID();
            
            let url = this.root_url + 'me/avatar/haircuts';
            const { data } = await HTTPService.get(url);
            return data;
        } catch (e) {
            console.log(e);
            return Promise.reject(e);
        }
    },

    async getPlayerData(id) {
        try {
            let url = this.root_url+id;
            const { data } = await HTTPService.get(url);
            return data;
        } catch (e) {
            console.log(e);
            return Promise.reject(e);
        }
    },

    async saveAvatarData(queryBody) {
        try {
            let url = this.root_url + 'me';
            const { data } = await HTTPService.post(url, {"data": queryBody});
            return data;
        } catch (e) {
            console.log(e);
            return Promise.reject(e);
        }
    },

    async getAvatarData(user_id) {
        try {
            let url = this.root_url + '' + user_id;
            const { data } = await HTTPService.get(url);
            return data;
        } catch (e) {
            console.log(e);
            return Promise.reject(e);
        }
    }
}

export default avatarService;