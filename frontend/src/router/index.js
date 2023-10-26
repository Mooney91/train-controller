import { createRouter, createWebHistory } from 'vue-router'
import TrafficController from '@/views/TrafficController.vue'
import LoginView from '@/views/LoginView.vue'
import ExistingTickets from '@/views/ExistingTickets.vue'
import TicketView from '@/views/TicketView.vue'
import SingleView from '@/views/SingleView.vue'
import UpdateTicket from '@/views/UpdateTicket.vue'
// import App from '../App.vue'

const routes = [
    {
        path: '/',
        name: 'TrafficController',
        component: TrafficController
    },
    {
        path: '/login',
        name: 'LoginView',
        component: LoginView
    },
    {
        path: '/existing-tickets',
        name: 'ExistingTickets',
        component: ExistingTickets
    },
    {
        path: '/ticket/:id',
        name: 'TicketView',
        component: TicketView,
    },
    {
        path: '/train/:id',
        name: 'SingleView',
        component: SingleView,
    },
    {
        path: '/update/:id',
        name: 'UpdateTicket',
        component: UpdateTicket,
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes: routes
})

export default router