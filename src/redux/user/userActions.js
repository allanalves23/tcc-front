import { setAuthToken } from '@/config/axios';

export function setUser(user) {
  if (user && user.accessToken) {
    setAuthToken(user.accessToken);
  }

  return {
    type: 'SAVE_USER',
    user: user && user.user,
  };
}

export default { setUser };
