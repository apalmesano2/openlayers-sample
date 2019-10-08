import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import HeatMaps from '@/components/HeatMaps'
import Clusters from '@/components/Clusters'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/heat-maps',
      name: 'HeatMaps',
      component: HeatMaps
    },
    {
      path: '/clusters',
      name: 'Clusters',
      component: Clusters
    }
  ]
})
