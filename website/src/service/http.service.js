import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

const instanceCreator = ($axios) => ({
  getWithCred(url) {
    return $axios.get(url, {withCredentials: true})
  },
  postWithCred(url, data) {
    return $axios.post(url, data, {withCredentials: true})
  },
  saveHeader({key, value}) {
    $axios.defaults.headers.common[key] = value;
  },
  deleteHeader(key) {
    delete $axios.defaults.headers.common[key];
  },
  get(url, params) {
    return $axios.get(url, { params});
  },
  post(url, data) {
    return $axios.post(url, data);
  },
  put(url, data) {
    return $axios.put(url, data);
  },
  delete(url, data) {
    return $axios.delete(url, data)
  },
  customRequest(config) {
    return $axios(config);
  },
  successHandler(response) {
    return response;
  },
  errorHandler(error) {
    const {response} = error;
    return Promise.reject(response);
  },
  interceptorRef: null,
  mountInterceptor() {
    this.interceptorRef = $axios.interceptors.response.use(
      this.successHandler,
      this.errorHandler
    )
  },
  ejectInterceptor() {
    $axios.interceptors.response.eject(this.interceptorRef)
  }
  
});

const HTTPService = instanceCreator(axiosInstance);
HTTPService.mountInterceptor();
export default HTTPService;