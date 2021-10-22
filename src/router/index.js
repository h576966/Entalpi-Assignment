import { supabase } from '@/supabase'
import { createRouter, createWebHistory} from 'vue-router'
import Home from '@/views/Home.vue'


const routes = [
  {path: '/', name: 'Home', component: Home, meta: { requiresAuth: true,}},
  {path: '/signIn', name: 'SignIn', component: ()=>import('@/views/SignIn.vue')},
  {path: '/signUp', name: 'SignUp', component: ()=>import('@/views/SignUp.vue')}

]

const router = createRouter( {
    history: createWebHistory(),
    routes
})

router.beforeEach((to, from, next) => {
  const currentUser = supabase.auth.user();
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

  if(requiresAuth && !currentUser) next('signIn');
  else if(!requiresAuth && currentUser) next("/");
  else next();
})

export default router
