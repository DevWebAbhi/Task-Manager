import axios from 'axios';

const REACT_APP_BACKEND_URL = process.env.REACT_APP_BACKEND_URL;


const axiosInstance = axios.create({
  baseURL: REACT_APP_BACKEND_URL, 
  headers: {
    'Content-Type': 'application/json',
  },
});

function configureTokenAxios(){
  const storedToken = localStorage.getItem('TASK-MANAGER-AUTH-TOKEN');
  if (storedToken) {
    const token = JSON.parse(storedToken);
    if (token && token.token) {
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token.token}`;
    }
  }
}

configureTokenAxios();

export {configureTokenAxios};


export default axiosInstance;