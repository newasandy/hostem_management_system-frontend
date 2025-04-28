import { createRouter, createWebHistory } from "vue-router";
import Home from "../view/Home.vue";
import Login from "../view/Login.vue";
import ViewStudent from "../view/admin/ViewStudent.vue";
import MyAutoComplete from "../view/MyAutoComplete.vue";
import { useAuthStore } from "../service/useAuth";

const routes = [
  { path: "/", name: "Home", component: Home },
  { path: "/login", name: "Login", component: Login },
  { path: "/autoComplete", name: "AutoC", component: MyAutoComplete },
  {
    path: "/student",
    name: "Student",
    component: ViewStudent,
    meta: { requiresAuth: true, roles: ["ADMIN"] },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const auth = useAuthStore();
  if (to.meta.requiresAuth && !auth.isLoggedIn) {
    next({ name: "Login" });
  } else if (to.meta.roles && !to.meta.roles.includes(auth.userRole)) {
    next({ name: "Home" });
  } else {
    next();
  }
});

export default router;
