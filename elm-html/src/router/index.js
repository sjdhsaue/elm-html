import {createRouter, createWebHashHistory} from 'vue-router'



import BusinessInfo from "@/views/BusinessInfo";
import Login from "@/views/Login";
import IndexView from "@/views/IndexView";
import Error from "@/views/Error";
const routes=[
    {
      path: '/',
      name: 'home',
      component: Login,

    },
    {
      path: '/businessInfo',
      name: 'BusinessInfo',
      component: BusinessInfo,


    }, {
      path: '/index',
      name: 'Index',
      component: IndexView
    },{
      path:'/error',
      name:'Error',
      component:Error
    }, {
      path: '/index',
      name: 'Index',
      component: IndexView
    }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})
export default router
