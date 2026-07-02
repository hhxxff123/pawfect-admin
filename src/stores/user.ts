import { defineStore } from 'pinia';

export interface UserInfo {
  [key: string]: any;
}

export const useUserStore = defineStore('user', {
  state: () => ({
    token: localStorage.getItem('token') || '',
    userInfo: null as UserInfo | null,
  }),
  actions: {
    setToken(token: string) {
      this.token = token;
      localStorage.setItem('token', token);
    },
    setUserInfo(info: UserInfo) {
      this.userInfo = info;
    },
    logout() {
      this.token = '';
      this.userInfo = null;
      localStorage.removeItem('token');
    },
  },
});
