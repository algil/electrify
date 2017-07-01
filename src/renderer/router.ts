import Vue from "vue"
import Router from "vue-router"

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: "/",
      name: "dashboard",
      component: require("@/components/Dashboard")
    },
    {
      path: "/prerequisites",
      name: "prerequisites",
      component: require("@/components/prerequisites")
    },
    {
      path: "*",
      redirect: "/prerequisites"
    }
  ]
})
