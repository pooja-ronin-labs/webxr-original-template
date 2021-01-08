import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_GATEWAY_URL,
  // baseURL: 'https://217fa4eb58a5.ngrok.io/' //test
});

export const instanceCreator = ($axios) => ({
  saveHeader({key, value}) {
    $axios.defaults.headers.common[key] = value;
  },
  deleteHeader(key) {
    delete $axios.defaluts.header.common[key];
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
    console.log(response);
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

// function CreateCustomInstance(url)
// {
//   let customInstance = axios.create({
//     baseURL: 'https://gateway.dev.theoneplusworld.com/',
//   });
//   let HTTPServiceFreeRoamingWorld = this.instanceCreator(customInstance);
//   HTTPServiceFreeRoamingWorld.mountInterceptor();
//   return HTTPServiceFreeRoamingWorld;
// }

const HTTPService = instanceCreator(axiosInstance);
HTTPService.mountInterceptor();
export default HTTPService;