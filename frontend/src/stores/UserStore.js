import { defineStore } from 'pinia'

export const useUserStore = defineStore('UserStore', {
    state: () => ({
        user: null
    }),
    actions: {
        addUser(newUser) {
            this.user = newUser
        }
    }
})

