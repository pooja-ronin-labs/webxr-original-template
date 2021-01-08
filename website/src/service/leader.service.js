import HTTPService from './http.service';

export const leaderBoardService = {
  async getGloabal(type) {
    try {
      const {data} = await HTTPService.get(`/api/leaderboard/${type||'global'}`);
      return data
    } catch(e) {
      return Promise.reject(e);
    }
  },
  async getPoints() {
    try {
      const {data:{leaderboard}} = await HTTPService.get('/api/leaderboard/current_score');
      return leaderboard
    }catch(e) {
      return Promise.reject(e);
    }
  }
}