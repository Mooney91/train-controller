<script>
    import { useUserStore } from './stores/UserStore'
    import NavigationComponent from './components/NavigationComponent.vue';

    export default {
        name: 'App',
        components: {
            NavigationComponent
        },
        setup() {
            const userStore = useUserStore()

            return {userStore}
        },
        data()  {
            return {
                backend: "http://localhost:1337"
            }
        }
    }
</script>

<template>
    <NavigationComponent></NavigationComponent>
    <router-view :backend="backend"></router-view>
</template>

<style>
</style>