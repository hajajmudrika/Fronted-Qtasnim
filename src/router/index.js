import { createRouter, createWebHistory } from 'vue-router'

const routes = [
    {
        path: '/',
        name: 'home',
        component: () => import( /* webpackChunkName: "home" */ '../views/Home.vue')
    },
    {
        path: '/products',
        name: 'products.index',
        component: () => import( /* webpackChunkName: "index" */ '../views/Products/Index.vue')
    },
    {
        path: '/products/create',
        name: 'products.create',
        component: () => import( /* webpackChunkName: "create" */ '../views/Products/Create.vue')
    },
    {
        path: '/products/edit/:id',
        name: 'products.edit',
        component: () => import( /* webpackChunkName: "edit" */ '../views/Products/Edit.vue')
    },
    {
        path: '/product-types',
        name: 'productTypes.index',
        component: () => import( /* webpackChunkName: "index" */ '../views/ProductTypes/Index.vue')
    },
    {
        path: '/product-types/create',
        name: 'productTypes.create',
        component: () => import( /* webpackChunkName: "create" */ '../views/ProductTypes/Create.vue')
    },
    {
        path: '/product-types/edit/:id',
        name: 'productTypes.edit',
        component: () => import( /* webpackChunkName: "edit" */ '../views/ProductTypes/Edit.vue')
    },
    {
        path: '/transactions',
        name: 'transactions.index',
        component: () => import( /* webpackChunkName: "index" */ '../views/Transactions/Index.vue')
    },
    {
        path: '/transactions/create',
        name: 'transactions.create',
        component: () => import( /* webpackChunkName: "create" */ '../views/Transactions/Create.vue')
    },
    {
        path: '/transactions/edit/:id',
        name: 'transactions.edit',
        component: () => import( /* webpackChunkName: "edit" */ '../views/Transactions/Edit.vue')
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router