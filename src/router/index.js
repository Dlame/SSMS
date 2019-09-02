import Vue from 'vue';
import Router from 'vue-router';
import Login from '@/views/login';
import NotFound from '@/views/404';
import Home from '@/views/home';
import Main from '@/views/main';
import Register from '@/views/nav1/Register';
import Stusearch from '@/views/nav1/stusearch';
import Information from '@/views/nav2/information';
import InformationIn from '@/views/nav2/informationIn';
import CostInfo from '@/views/nav2/costInfo';
import CostIn from '@/views/nav2/costIn';
import GradeInfo from '@/views/nav2/gradeInfo';
import GradeIn from '@/views/nav2/gradein';
import CheckIn from '@/views/nav3/checkin';
import CheckSearch from '@/views/nav4/checkSearch';

import store from '../store/index';

import { Message } from 'element-ui';

Vue.use(Router);

var router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login,
      hidden: true,
      alias: '/login'
    },
    {
      path: '/404',
      component: NotFound,
      name: '',
      hidden: true
    },
    {
      path: '/home',
      component: Home,
      name: '首页',
      hidden: true,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/home',
      component: Home,
      name: '首页',
      hidden: true,
      children: [
        {
          path: '/main',
          component: Main,
          name: '首页',
          meta: {
            requiresAuth: true
          }
        }
      ]
    },
    {
      path: '/home',
      component: Home,
      name: '意向学员',
      iconCls: 'fa fa-file-text-o fa-lg',
      children: [
        {
          path: '/stusearch',
          component: Stusearch,
          name: '学员查询',
          iconCls: 'fa fa-search fa-lg',
          meta: {
            requiresAuth: true
          }
        },
        {
          path: '/register',
          component: Register,
          name: '学员登记',
          iconCls: 'fa fa-pencil-square-o fa-lg',
          meta: {
            requiresAuth: true
          }
        }
      ]
    },
    {
      path: '/home',
      component: Home,
      name: '学员管理',
      iconCls: 'fa fa-cog fa-lg',
      children: [
        {
          path: '/information',
          component: Information,
          name: '基本信息',
          iconCls: 'fa fa-user-circle',
          meta: {
            requiresAuth: true
          }
        },
        {
          path: '/informationIn',
          component: InformationIn,
          name: '信息录入',
          iconCls: 'fa fa-pencil fa-lg',
          meta: {
            requiresAuth: true
          }
        },
        {
          path: '/gradeInfo',
          component: GradeInfo,
          name: '成绩信息',
          iconCls: 'fa fa-bar-chart',
          meta: {
            requiresAuth: true
          }
        },
        {
          path: '/gradeIn',
          component: GradeIn,
          name: '成绩录入',
          iconCls: 'fa fa-pencil fa-lg',
          meta: {
            requiresAuth: true
          }
        }
      ]
    },
    {
      path: '/home',
      component: Home,
      name: '费用管理',
      iconCls: 'fa fa-credit-card-alt',
      children: [
        {
          path: '/costInfo',
          component: CostInfo,
          name: '费用信息',
          iconCls: 'fa fa-credit-card',
          meta: {
            requiresAuth: true
          }
        },
        {
          path: '/costIn',
          component: CostIn,
          name: '费用录入',
          iconCls: 'fa fa-pencil fa-lg',
          meta: {
            requiresAuth: true
          }
        }
      ]
    },
    {
      path: '/home',
      component: Home,
      name: '刷卡签到',
      iconCls: 'fa fa-calendar fa-lg',
      children: [
        {
          path: '/checkIn',
          component: CheckIn,
          name: '考勤录入',
          iconCls: 'fa fa-pencil fa-lg',
          meta: {
            requiresAuth: true
          }
        }
      ]
    },
    {
      path: '/home',
      component: Home,
      name: '查询统计',
      iconCls: 'fa fa-search fa-lg',
      children: [
        {
          path: '/CheckSearch',
          component: CheckSearch,
          name: '考勤查询',
          iconCls: 'fa fa-search fa-lg',
          meta: {
            requiresAuth: true
          }
        }
      ]
    },
    {
      path: '*',
      component: NotFound,
      name: '',
      hidden: true
    }
  ]
});

// 页面刷新时，重新赋值有没登录
if (document.cookie) {
  store.commit('setIsLogin', window.localStorage.getItem('isLogin'));
}

router.beforeEach(function(to, from, next) {
  if (to.matched.some(r => r.meta.requiresAuth)) {
    // 判断该路由是否需要登录权限
    console.log(store.getters.isLogin);
    if (store.getters.isLogin) {
      // 通过vuex 如果当前有登录
      next();
    } else {
      Message.error({
        message: '未登录!'
      });
      next({
        path: '/login',
        query: {
          redirect: to.fullPath
        }
      });
    }
  } else {
    next();
  }
});

export default router;
