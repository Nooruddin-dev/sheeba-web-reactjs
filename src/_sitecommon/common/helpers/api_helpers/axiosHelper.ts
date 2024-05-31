
import axios, { AxiosResponse } from 'axios';


import { getBusnPartnerIdAndTokenFromStorage } from '../global/GlobalHelper';
import { API_URL } from '../../constants/Config';


export const apiRequest = axios.create({
  baseURL: API_URL,
  //   responseType: 'json',
    headers: {
      //'Access-Control-Allow-Headers': '*'
      'busnPartnerId': getBusnPartnerIdAndTokenFromStorage()?.busnPartnerId,
      'Authorization': `Bearer ${getBusnPartnerIdAndTokenFromStorage()?.jwtToken}`,
      
    },
});
apiRequest.interceptors.response.use(
  (response: AxiosResponse<any, any>) => {
    console.log(response);
    
    if (response.status === 200 || response.status === 201) {
      return response; // Return the response for successful requests
    } else {
      // Handle other status codes if needed
      return Promise.reject(response); // Reject the promise for other status codes
    }
  },
  (error) => {
    
    console.log('interceptors error', error);
    if (error.response.status == 401) {
      console.error(error)
    }
    return Promise.reject(error?.response);
  },
);

export const setAuthToken = (jwtToken: string, busnPartnerId: any) => {
  if (jwtToken) {
    apiRequest.defaults.headers.common['Authorization'] = `Bearer ${jwtToken}`;
  } else {
    delete apiRequest.defaults.headers.common['Authorization'];
  }

  
  if (busnPartnerId && busnPartnerId > 0) {
    apiRequest.defaults.headers.common['busnPartnerId'] = `${busnPartnerId}`;
  } else {
    delete apiRequest.defaults.headers.common['busnPartnerId'];
  }

};





export default apiRequest;