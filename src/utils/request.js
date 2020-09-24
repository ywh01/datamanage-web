import axios from 'axios';
import db from '@/utils/localstorage'
import { Message } from 'element-ui';

const service = axios.create({
  // process.env.NODE_ENV === 'development' 来判断是否开发环境
  // easy-mock服务挂了，暂时不使用了
  baseURL: 'http://localhost:9001',
  timeout: 36000
});

let AUTH_TOKEN=(function(){
  return localStorage.getItem("token");
})();

service.interceptors.request.use(
  config => {
    //config.headers.token = db.get('TOKEN', '');
    let token = localStorage.getItem('token');
    if(token){
      config.headers.common['Authorization'] = token
    }
    config.headers.common['Content-Type'] = 'application/json;charset=UTF-8'
    config.headers.withCredentials= true
    return config;
    },
    error => {
      console.log(error);
      return Promise.reject();
    }
);

service.interceptors.response.use(
    response => {
      if (response.data.code === 400 ||
        response.data.code === 404 ||
        response.data.code === 500) {
         Message.error(response.data.message);
         return response.data;
        // t ElementUI.his.$message.error(response.data.message);   
      } else {
          //   Promise.reject();
        return response.data;
      }
    },
    error => {
      console.log(error);
      return Promise.reject();
    }
);

export default service;
