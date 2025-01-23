import { lazy } from 'react';

export const routes = [
  {
    path: '/',
    component: lazy(() => import('@/views/list')),
  },
  {
    path: '/login',
    component: lazy(() => import('@/views/login')),
  },
  {
    path: '/detail',
    component: lazy(() => import('@/views/detail')),
  },
  // {
  //   path: '/add-topic',
  //   meta: { requiredLogin: true },
  //   // component: () => import('@/views/edit-topic/index.vue')
  // },
  // {
  //   path: '/edit-topic/:id',
  //   meta: { requiredLogin: true },
  //   // component: () => import('@/views/edit-topic/index.vue')
  // },
  // {
  //   path: '/message',
  //   meta: { requiredLogin: true },
  //   // component: () => import('@/views/message/index.vue')
  // },
  // {
  //   path: '/collect',
  //   meta: { requiredLogin: true },
  //   // component: () => import('@/views/collect/index.vue')
  // },
  // {
  //   path: '/user/:userName',
  //   meta: { requiredLogin: true },
  //   // component: () => import('@/views/user-detail/index.vue')
  // }
];
