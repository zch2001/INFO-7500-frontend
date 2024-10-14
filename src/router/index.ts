import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import BestTen from '@/components/BestTen.vue';
import TBD from '@/components/TBD.vue';

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        redirect: '/tbd',
    },
    {
        path: '/bestten',
        name: 'bestten',
        component: BestTen,
    },
    {
        path: '/tbd',
        name: 'tbd',
        component: TBD,
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
