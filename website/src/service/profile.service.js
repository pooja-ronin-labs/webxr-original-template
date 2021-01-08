import HTTPService from './http.service';

export const profileService = {
  async getProgress() {
    try {
      const {data: {all_events, events}} = await HTTPService.get('/api/player/me/event');
      return {all_events, events}
    } catch(e) {
      return Promise.reject(e);
    }
  }
}