import HTTPService from './httpFreeroamingWorld.service';
import HTTPServiceBackend from './http.service';
import HTTPServiceTimer from './httpTimer.service';
import store from '../store/store';
const freeRoamingWorld = {

    root_url: 'gateway/',

    getUserID()
    {
        let app_state = store.getState();
        console.log("State: ", app_state);
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

    async getPublicRoomSocketAddress() {
        try {
            let url = this.root_url + 'getPublicAddr';
            var auth = 'Bearer ' + this.getBearerToken();
            HTTPService.saveHeader({key: 'Authorization', value: auth});
            const { data } = await HTTPService.get(url);
            return data;
        } catch (e) {
            console.log(e);
            return Promise.reject(e);
        }
    },
    async getPrivateRoomSocketAddress(room) {
        try {
            let url = this.root_url + 'getPrivateAddr/'+room;
            var auth = 'Bearer ' + this.getBearerToken();
            HTTPService.saveHeader({key: 'Authorization', value: auth});
            const { data } = await HTTPService.get(url);
            return data;
        } catch (e) {
            console.log(e);
            return Promise.reject(e);
        }
    },
    async getLatestPhotosForGallary() {
        try {
            let url = 'api/images';
            var auth = 'Bearer ' + this.getBearerToken();
            HTTPServiceBackend.saveHeader({key: 'Authorization', value: auth});
            const { data } = await HTTPServiceBackend.get(url);
            return data;
        } catch (e) {
            console.log(e);
            return Promise.reject(e);
        }
    },
    async getEventStartTimer() {
        try {
            let url = 'api/timer';
            var auth = 'Bearer ' + this.getBearerToken();
            HTTPServiceBackend.saveHeader({key: 'Authorization', value: auth});
            const { data } = await HTTPServiceBackend.get(url);
            return data;
        } catch (e) {
            console.log(e);
            return Promise.reject(e);
        }
    },

    async getEventStartTimerV2() {
        try {
            let timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
            let url = 'api/timer?timezone='+timezone;
            // var auth = 'Bearer ' + this.getBearerToken();
            // HTTPServiceBackend.saveHeader({key: 'Authorization', value: auth});
            const { data } = await HTTPServiceBackend.get(url);
            return data;
        } catch (e) {
            console.log(e);
            return Promise.reject(e);
        }
    },
}

export default freeRoamingWorld;