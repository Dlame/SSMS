import Vue from 'vue';
import Vuex from 'vuex';
import login from './login'
import getters from './getters';

Vue.use(Vuex);

const store = new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  modules: {
    login
  },
  getters
});

export default store
