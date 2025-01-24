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
  {
    path: '/add-topic',
    meta: { requiredLogin: true },
    component: lazy(() => import('@/views/edit-topic')),
  },
  {
    path: '/edit-topic/:id',
    meta: { requiredLogin: true },
    component: lazy(() => import('@/views/edit-topic')),
  },
  {
    path: '/message',
    meta: { requiredLogin: true },
    component: lazy(() => import('@/views/message')),
  },
  {
    path: '/collect',
    meta: { requiredLogin: true },
    component: lazy(() => import('@/views/collect')),
  },
  {
    path: '/user/:userName',
    component: lazy(() => import('@/views/user-detail')),
  },
];
