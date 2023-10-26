<template>
    <div id="header-container">
        <div id="header" class="topnav">
            <img src="/train-solid.svg" id="logoImage">
            Tågverket
            <router-link to="/">Karta</router-link>
            <router-link to="/existing-tickets">Hantera befintliga ärende</router-link>
            <router-link to="/login">Logga in/Registrera</router-link>
            <div class="welcome" v-if="userStore.user !== null">
              <span class="user-welcome">Välkommen {{ userStore.user.username }}</span>
              <span class="logout" @click="logout()">Logga ut</span>
            </div>
        </div>
    </div>
</template>

<script>
    import { useUserStore } from '../stores/UserStore'

    export default {
        name: 'NavigationComponent',
        setup() {
            const userStore = useUserStore()

            return {userStore}
        },
        methods: {
            logout() {
                useUserStore().addUser(null);
            }
        }
    }
</script>

<style>

</style>