import axios from 'axios';
import { backendUrl } from './backend';
import { goToHome } from '../shared/index';

const success = (resp) => resp;

const error = (err) => {
  const user = localStorage.getItem('user');

  if (err && err.response && user) {
    const code = err.response.status;

    if (code === 401) {
      localStorage.removeItem('user');
      goToHome();
    }

    if (code === 406) {
      setTimeout(() => {
        goToHome();
      }, 3000);
    }
  }

  return Promise.reject(err);
};

export function setAuthToken(newToken) {
  const storage = JSON.parse(localStorage.getItem('user'));

  const currentToken = storage ? storage.accessToken : null;
  const token = newToken || currentToken;

  if (token) {
    axios.defaults.headers.common.Authorization = `bearer ${token}`;
  } else {
    delete axios.defaults.headers.common.Authorization;
  }
}

axios.interceptors.response.use(success, error);
axios.defaults.baseURL = backendUrl;
axios.defaults.timeout = 20000;

export default { setAuthToken };
